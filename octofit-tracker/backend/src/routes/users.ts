import { Router } from 'express';
import { User } from '../models.js';

export const userRouter = Router();

userRouter.get('/', async (_request, response) => {
  response.json(await User.find().sort({ createdAt: -1 }));
});

userRouter.post('/', async (request, response) => {
  const user = await User.create(request.body);
  response.status(201).json(user);
});