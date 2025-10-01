import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/users.js';
import pollRoute from './routes/polls.js';
import { authMiddleware } from './middleware.js';
import voteRoute from './routes/vote.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoute);
app.use('/poll',authMiddleware,pollRoute);
app.use('/vote',authMiddleware,voteRoute);


app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
