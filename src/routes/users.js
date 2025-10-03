import express from 'express'
import prisma from '../lib/prisma.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


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

        const token= jwt.sign(
            { id: newUser.id, email: newUser.email }
            ,process.env.JWT_SECRET,{expiresIn:"1d"}
        )


        res.status(201).json({
            message:"User sign up successfully ",
            user:{name:newUser.name, id: newUser.id, email: newUser.email },
            token:token
        });
        
    }catch{
        res.status(200).json({
            Error:"Server error "
        })
    }


})

router.post('/login',async(req,res)=>{
    const {email,  password}=req.body;

    console.log( "email , pass", email, password);

    try{
        if(!email || !password){
        res.status(300).json({
            message:"Please enter credentials!"
        })
        return;
    }

    const user= await prisma.user.findUnique({
        where:{email},
    })

    if(!user){
        res.status(400).send("user not found");
        return;
    }

    const isMatch=await bcrypt.compare(password, user.passwordHash);

    if(!isMatch){
        res.status(300).json({
            message:"please enter correct password"
        })
        return;
    }

    const token= jwt.sign(
        { id: user.id, email: user.email }
        ,process.env.JWT_SECRET,{expiresIn:"1d"}
    )

    res.status(201).json({
        message:"logged in successfully!!",
        user:{name:user.name, id: user.id, email: user.email },
        token:token
    })

    }catch(error){
        console.log("error during login -", error);

        res.status(500).json({
            message:"server error ",
            error
        })
    }
})

export default router;