import express from 'express';
import { apiRouter } from './routes/apiRouter.js';

export function createApiApp(): express.Express {
  const app = express();
  app.set('trust proxy', 2);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use('/api', apiRouter);
  return app;
}
