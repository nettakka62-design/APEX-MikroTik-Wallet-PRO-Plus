const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: true } : undefined });
pool.on('error', (err) => console.error('Unexpected PostgreSQL pool error:', err.message));
module.exports = { pool, query: (text, params) => pool.query(text, params) };
