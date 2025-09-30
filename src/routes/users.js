import express from 'express'
import prisma from '../lib/prisma.js';
import bcrypt from "bcrypt";

const router= express.Router();

router.post('/signup',async(req, res)=>{
    const {name,email,  password}=req.body;

    console.log("name, email , pass", name, email, password);

    if(!name || !email || !password){
        res.status(400).send("please add credential!");
        return;
    }

    try{

        
        const existingUser= await prisma.user.findUnique({
            where:{email:email}
        })
        console.log(existingUser)
        if(existingUser){
            res.status(300).send("user alredy exist , please try another email id!!");
            return;
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser= await prisma.user.create({
           data:{
            name,
            passwordHash:hashedPassword,
            email
           } 
        })

        res.status(201).json({
            message:"User sign up successfully ",
            user:newUser
        });
        
    }catch{
        res.status(200).json({
            Error:"Server error "
        })
    }
    
    // res.status(200).send("signup completed")


})

export default router;