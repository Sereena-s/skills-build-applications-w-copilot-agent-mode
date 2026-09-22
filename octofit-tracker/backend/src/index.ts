import express from 'express';
import mongoose from 'mongoose';
import { activityRouter } from './routes/activities.js';
import { teamRouter } from './routes/teams.js';
import { userRouter } from './routes/users.js';
import { workoutRouter } from './routes/workouts.js';

const app = express();
const port = 8000;
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db';

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/teams', teamRouter);
app.use('/api/activities', activityRouter);
app.use('/api/workouts', workoutRouter);
app.get('/api/leaderboard', async (_request, response) => {
  const leaderboard = await mongoose.connection.db?.collection('activities').aggregate([
    { $group: { _id: '$userId', points: { $sum: '$points' }, activities: { $sum: 1 } } },
    { $sort: { points: -1 } },
  ]).toArray();
  response.json(leaderboard ?? []);
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`);
});

mongoose.connect(mongoUri).catch((error: unknown) => {
  console.error('MongoDB connection failed:', error);
});