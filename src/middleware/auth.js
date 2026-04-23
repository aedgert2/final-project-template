import jwt from 'jsonwebtoken';

/**
 * Verifies the Bearer token in the Authorization header.
 * On success, attaches { id, username, role } to req.user.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please provide a Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, role }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Requires that the authenticated user has the ADMIN role.
 * Must be used after `authenticate`.
 */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }
  next();
};