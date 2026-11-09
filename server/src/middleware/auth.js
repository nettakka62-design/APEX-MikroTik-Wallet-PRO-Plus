const jwt = require('jsonwebtoken');
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\\s+/i, '');
  if (!token) return res.status(401).json({ error: 'AUTH_REQUIRED' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ error: 'FORBIDDEN' });
    req.admin = payload;
    next();
  } catch { return res.status(401).json({ error: 'INVALID_TOKEN' }); }
}
module.exports = { requireAdmin };
