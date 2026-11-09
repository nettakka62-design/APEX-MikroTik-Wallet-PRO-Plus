const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
router.post('/admin/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'USERNAME_AND_PASSWORD_REQUIRED' });
    const result = await query('SELECT id, username, password_hash FROM admins WHERE username=$1', [username]);
    const admin = result.rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    const token = jwt.sign({ sub: admin.id, role: 'admin', username: admin.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '12h' });
    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (e) { next(e); }
});
module.exports = router;
