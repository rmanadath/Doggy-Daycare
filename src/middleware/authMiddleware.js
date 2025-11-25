import jwt from 'jsonwebtoken';

// Hardcoded secret ONLY FOR TEMPORARY DEVELOPMENT
// will change later
const JWT_SECRET = 'dev_secret';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Malformed Authorization header' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload: { userId, role, iat, exp }
    req.user = { id: payload.userId, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
