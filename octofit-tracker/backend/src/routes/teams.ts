import { Router } from 'express';
import { Team } from '../models.js';

export const teamRouter = Router();

teamRouter.get('/', async (_request, response) => {
  response.json(await Team.find().populate('captainId memberIds'));
});

teamRouter.post('/', async (request, response) => {
  const team = await Team.create(request.body);
  response.status(201).json(team);
});