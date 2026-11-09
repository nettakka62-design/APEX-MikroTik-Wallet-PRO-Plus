require('dotenv').config();
const fs=require('fs');const path=require('path');const bcrypt=require('bcryptjs');const {pool}=require('./db');
(async()=>{try{
  const sql=fs.readFileSync(path.join(__dirname,'../db/schema.sql'),'utf8');
  await pool.query(sql);
  const username=process.env.ADMIN_USERNAME;const password=process.env.ADMIN_PASSWORD;
  if(username && password && password!=='ChangeThis-Immediately'){
    const hash=await bcrypt.hash(password,12);
    await pool.query('INSERT INTO admins(username,password_hash) VALUES($1,$2) ON CONFLICT(username) DO NOTHING',[username,hash]);
    console.log(`Admin account ensured: ${username}`);
  } else console.warn('Admin seed skipped: set ADMIN_USERNAME and a non-placeholder ADMIN_PASSWORD in .env, then rerun migration.');
  console.log('Database schema applied.');
}catch(e){console.error(e.message);process.exitCode=1;}finally{await pool.end();}})();
