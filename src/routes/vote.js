import express from 'express';
import prisma from '../lib/prisma.js';
import { broadcast } from '../server.js'; // import broadcast helper

const router = express.Router();

router.post('/votesubmit', async (req, res) => {
  const userId = req.user.id;
  const { optionId } = req.body; 
  const optionIdInt = Number(optionId);

  if (isNaN(optionIdInt)) {
    return res.status(400).json({ error: "Invalid optionId" });
  }

  try {
    const option = await prisma.pollOption.findUnique({
      where: { id: optionIdInt }, 
      include: { poll: true }
    });

    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        option: { pollId: option.pollId }
      }
    });

    if (existingVote) {
      return res.status(400).send("You have already voted in this poll");
    }

    const vote = await prisma.vote.create({
      data: {
        userId,
        optionId: optionIdInt
      }
    });

    const poll = await prisma.poll.findUnique({
      where: { id: option.pollId },
      include: {
        options: { include: { votes: true } }
      }
    });

    const optionCounts = poll.options.map(opt => ({
      optionId: opt.id,
      text: opt.text,
      count: opt.votes.length
    }));

    broadcast({
      type: "VOTE_UPDATE",
      pollId: poll.id,
      optionCounts
    });

    res.status(201).json({
      message: "Vote submitted successfully",
      vote
    });

  } catch (e) {
    console.log("error during vote - ", e);
    res.status(500).json({
      message: "server error",
      error: e
    });
  }
});

export default router;
