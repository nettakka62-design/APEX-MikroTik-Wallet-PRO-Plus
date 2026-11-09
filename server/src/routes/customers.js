const router = require('express').Router();
const { query } = require('../db');
const { requireAdmin } = require('../middleware/auth');
const fields = `id, full_name AS name, phone, username, service_type AS type, package_name AS package, total_gb AS "totalGb", used_gb AS "usedGb", price, expires_at AS "expireDate", status, router_id`;
router.get('/', requireAdmin, async (_req, res, next) => { try { const r = await query(`SELECT ${fields} FROM customers ORDER BY id DESC`); res.json(r.rows); } catch(e){next(e);} });
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, phone, username, type, package: pkg, totalGb=0, usedGb=0, price=0, expireDate=null, status='active', routerId=null } = req.body || {};
    if (!name || !phone || !username || !pkg || !['Hotspot','PPPoE'].includes(type)) return res.status(400).json({error:'INVALID_CUSTOMER_DATA'});
    const r = await query(`INSERT INTO customers(full_name,phone,username,service_type,package_name,total_gb,used_gb,price,expires_at,status,router_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING ${fields}`,[name,phone,username,type,pkg,totalGb,usedGb,price,expireDate,status,routerId]);
    res.status(201).json(r.rows[0]);
  } catch(e){ if(e.code==='23505') return res.status(409).json({error:'PHONE_OR_USERNAME_EXISTS'}); next(e); }
});
router.patch('/:id/status', requireAdmin, async (req,res,next)=>{ try { const {status}=req.body||{}; if(!['active','disabled','expired'].includes(status)) return res.status(400).json({error:'INVALID_STATUS'}); const r=await query(`UPDATE customers SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING ${fields}`,[status,req.params.id]); if(!r.rowCount)return res.status(404).json({error:'CUSTOMER_NOT_FOUND'}); res.json(r.rows[0]); }catch(e){next(e);} });
module.exports = router;
