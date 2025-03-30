import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const activePolls = new Map();
const students = new Map();
const pollResults = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('teacher:create_poll', (poll) => {
    activePolls.set(poll.id, {
      ...poll,
      answers: new Map(),
    });
    io.emit('poll:new', poll);
  });

  socket.on('student:register', ({ name, id }) => {
    students.set(id, { name, socketId: socket.id });
    socket.emit('student:registered', { id, name });
  });

  socket.on('student:submit_answer', ({ pollId, studentId, answer }) => {
    const poll = activePolls.get(pollId);
    if (poll && !poll.answers.has(studentId)) {
      poll.answers.set(studentId, answer);
      
      const results = calculateResults(poll);
      pollResults.set(pollId, results);
      
      io.emit('poll:results_update', {
        pollId,
        results,
        totalResponses: poll.answers.size
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

function calculateResults(poll) {
  const results = {};
  poll.options.forEach(option => results[option] = 0);
  
  for (const answer of poll.answers.values()) {
    results[answer] = (results[answer] || 0) + 1;
  }
  
  return results;
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});