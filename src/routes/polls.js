import express from 'express'
import prisma from '../lib/prisma.js'

const router=express.Router();

router.post('/createpoll',async(req,res)=>{

    const {question, options}=req.body;
    const userId = req.user.id; 

    console.log("question",question)
    console.log("options-",options)
    console.log("user id-",userId)

    try{

        if (!question || !options || options.length < 2) {
            return res.status(400).json({ error: "Question and at least 2 options required" });
        }

        const poll= await prisma.poll.create({
             data: {
                question,
                isPublished: true,
                creator: { connect: { id: userId } },
                options: {
                create: options.map((text) => ({ text }))
                }
            },
            include: { options: true }
        })

        res.status(201).json({
            message:"poll created",
            poll
        })



    }catch(e){

        console.log("error during create poll- ", e);

        res.status(500).json({
            message:"server error "
        })
    }
    

})

router.get('/getpolls',async(req,res)=>{
      try {
    const polls = await prisma.poll.findMany({
        include: {
            creator: {
            select: { id: true, name: true, email: true }
            },
            options: {
            include: {
                votes: true  
            }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
        });


    res.status(201).json({
      message: "Polls fetched successfully",
      polls
    });
  } catch (e) {
    console.log("Error fetching polls - ", e);
    res.status(500).json({
      message: "Server error"
    });
  }

})
export default router;