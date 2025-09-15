import express from 'express'
import prisma from '../lib/prisma';

const router= express.Router();

router.post('/login',async(req, res)=>{
    const {name,email,  password}=req.body;
    console.log("name, email , pass", name, email, password);


})

export default router;