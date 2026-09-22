import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 8000;
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db';

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`);
});

mongoose.connect(mongoUri).catch((error: unknown) => {
  console.error('MongoDB connection failed:', error);
});