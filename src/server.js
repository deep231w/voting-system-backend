import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/users.js';
import pollRoute from './routes/polls.js';
import { authMiddleware } from './middleware.js';
import voteRoute from './routes/vote.js';
import http from 'http';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoute);
app.use('/poll', authMiddleware, pollRoute);
app.use('/vote', authMiddleware, voteRoute);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected ✅");
  ws.on("close", () => console.log("Client disconnected ❌"));
});

// helper to broadcast messages
export function broadcast(data) {
  const json = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(json);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
