import * as authService from '../services/authService.js';

export const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};
