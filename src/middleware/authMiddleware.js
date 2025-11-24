// TODO: Implement JWT authentication when auth endpoints are ready

export const authenticate = async (req, res, next) => {
  if (process.env.NODE_ENV === 'development' && req.headers['x-test-user-id']) {
    req.user = { id: parseInt(req.headers['x-test-user-id']) };
    return next();
  }

  res.status(401).json({ error: 'Authentication required' });
};

