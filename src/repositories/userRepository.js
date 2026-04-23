import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

export const findByUsername = (username) =>
  prisma.user.findUnique({ where: { username } });

export const findByEmailOrUsername = (email, username) =>
  prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

export const createUser = (data) =>
  prisma.user.create({
    data,
    select: { id: true, username: true, email: true, role: true },
  });