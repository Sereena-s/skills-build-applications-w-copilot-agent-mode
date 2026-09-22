import { Router } from 'express';
import { Workout } from '../models.js';

export const workoutRouter = Router();

workoutRouter.get('/', async (request, response) => {
  const fitnessLevel = typeof request.query.fitnessLevel === 'string' ? request.query.fitnessLevel : undefined;
  const query = Workout.find().sort({ createdAt: -1 });
  if (fitnessLevel) {
    query.where('fitnessLevel').equals(fitnessLevel);
  }
  response.json(await query);
});

workoutRouter.post('/', async (request, response) => {
  const workout = await Workout.create(request.body);
  response.status(201).json(workout);
});