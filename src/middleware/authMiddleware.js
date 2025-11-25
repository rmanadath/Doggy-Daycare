import jwt from 'jsonwebtoken';

// Hardcoded secret ONLY FOR TEMPORARY DEVELOPMENT
const JWT_SECRET = 'dev_secret';

// Middleware to authenticate and normalize user object
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Malformed Authorization header' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Normalize payload keys for safety
    const userId = payload.userId ?? payload.UserId ?? payload.id;
    const role = payload.role ?? payload.Role ?? payload.ROLE;

    if (!userId || !role) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Attach normalized user to request
    req.user = {
      id: userId,
      role: role.toString().toLowerCase() // normalize role to lowercase
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Helper for controllers to check admin (case-insensitive)
export const isAdmin = (user) => user?.role === 'admin';
