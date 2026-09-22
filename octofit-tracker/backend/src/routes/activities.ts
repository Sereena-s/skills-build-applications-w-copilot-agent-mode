import { Router } from 'express';
import { Activity } from '../models.js';

export const activityRouter = Router();

activityRouter.get('/', async (_request, response) => {
  response.json(await Activity.find().populate('userId').sort({ completedAt: -1 }));
});

activityRouter.post('/', async (request, response) => {
  const activity = await Activity.create(request.body);
  response.status(201).json(activity);
});