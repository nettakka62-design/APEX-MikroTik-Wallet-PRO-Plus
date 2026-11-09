const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const ros = require('../services/mikrotik');
router.get('/test', requireAdmin, async (_req,res,next)=>{try{const info=await ros.testConnection();res.json({connected:true,identity:info['board-name']||null,version:info.version||null});}catch(e){next(e);}});
router.post('/customer/:id/enable', requireAdmin, async (req,res,next)=>{try{const {type,username}=req.body||{};if(!username||!['Hotspot','PPPoE'].includes(type))return res.status(400).json({error:'TYPE_AND_USERNAME_REQUIRED'});const result=type==='Hotspot'?await ros.setHotspotUserDisabled(username,false):await ros.setPppSecretDisabled(username,false);res.json({ok:true,result});}catch(e){next(e);}});
router.post('/customer/:id/disable', requireAdmin, async (req,res,next)=>{try{const {type,username}=req.body||{};if(!username||!['Hotspot','PPPoE'].includes(type))return res.status(400).json({error:'TYPE_AND_USERNAME_REQUIRED'});const result=type==='Hotspot'?await ros.setHotspotUserDisabled(username,true):await ros.setPppSecretDisabled(username,true);res.json({ok:true,result});}});
module.exports=router;
