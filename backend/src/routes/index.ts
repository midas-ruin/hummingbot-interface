import { Express } from 'express';
import authRoutes from './auth';
import botRoutes from './bot';
import orderRoutes from './order';
import marketRoutes from './market';

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/bots', botRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/market', marketRoutes);
};
