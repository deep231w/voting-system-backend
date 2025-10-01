import express from 'express';
import prisma from '../lib/prisma.js';

const router= express.Router();

router.post('/votesubmit',async(req,res)=>{
    const userId=req.user.id;
    const optionId=req.body;

    try{
        const option=await prisma.pollOption.findUnique({
            where:{
                id:optionId
            },
            include:{poll:true}
        })

        if (!option) {
            return res.status(404).json({ error: "Option not found" });
        }

        const existingVote = await prisma.vote.findFirst({
            where: {
                userId,
                option: { pollId: option.pollId }
            }
        });

        if(existingVote){
            return res.status(400).send("You have already voted in this poll");
        }

        const vote = await prisma.vote.create({
            data: {
                userId,
                optionId
            }
        });

        res.status(201).json({
            message:"Vote submitted successfully",
            vote
        })

    }catch(e){
        console.log("error during vote - ", e);

        res.status(500).json({
            message:"server error",
            error:e
        })
    }
})

export default router;