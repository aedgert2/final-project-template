import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepository.js';

const SALT_ROUNDS = 10;

export const signup = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    const err = new Error('username, email, and password are required.');
    err.status = 400;
    throw err;
  }

  const existing = await userRepo.findByEmailOrUsername(email, username);
  if (existing) {
    const err = new Error('Username or email already exists.');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userRepo.createUser({ username, email, passwordHash });
  return user; // { id, username, email, role }
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error('email and password are required.');
    err.status = 400;
    throw err;
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials.');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Invalid credentials.');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token };
};