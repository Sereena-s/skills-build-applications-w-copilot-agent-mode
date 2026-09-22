import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Workout.deleteMany({}),
      Leaderboard.deleteMany({}),
    ]);

    const users = await User.create([
      { username: 'maya.runner', email: 'maya.runner@mergington.edu', fitnessLevel: 'intermediate' },
      { username: 'liam.lifter', email: 'liam.lifter@mergington.edu', fitnessLevel: 'advanced' },
      { username: 'zoe.walker', email: 'zoe.walker@mergington.edu', fitnessLevel: 'beginner' },
    ]);

    await Team.create([
      { name: 'Trail Blazers', captainId: users[0]._id, memberIds: users.map((user) => user._id) },
      { name: 'Strength Squad', captainId: users[1]._id, memberIds: [users[1]._id] },
    ]);

    const activities = await Activity.create([
      { userId: users[0]._id, type: 'running', durationMinutes: 35, points: 70, completedAt: new Date('2026-09-18') },
      { userId: users[0]._id, type: 'walking', durationMinutes: 25, points: 25, completedAt: new Date('2026-09-20') },
      { userId: users[1]._id, type: 'strength', durationMinutes: 45, points: 90, completedAt: new Date('2026-09-19') },
      { userId: users[2]._id, type: 'walking', durationMinutes: 30, points: 30, completedAt: new Date('2026-09-21') },
    ]);

    await Workout.create([
      { title: 'Starter Cardio Circuit', fitnessLevel: 'beginner', activities: ['5-minute warm-up walk', '20-minute brisk walk', '5-minute cool-down'] },
      { title: 'Endurance Builder', fitnessLevel: 'intermediate', activities: ['10-minute warm-up', '25-minute steady run', '10-minute mobility'] },
      { title: 'Full-Body Strength Focus', fitnessLevel: 'advanced', activities: ['Goblet squats', 'Push-ups', 'Single-leg deadlifts', 'Plank holds'] },
    ]);

    const scores = new Map<string, { points: number; activities: number }>();
    for (const activity of activities) {
      const userId = activity.userId.toString();
      const current = scores.get(userId) ?? { points: 0, activities: 0 };
      scores.set(userId, { points: current.points + activity.points, activities: current.activities + 1 });
    }

    const leaderboard = [...scores.entries()]
      .sort(([, left], [, right]) => right.points - left.points)
      .map(([userId, score], index) => ({ userId, ...score, rank: index + 1 }));
    await Leaderboard.create(leaderboard);

    console.log(`Database seeding complete: ${users.length} users, ${activities.length} activities`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
