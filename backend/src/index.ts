import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import WebSocket from 'ws';
import { config } from 'dotenv';
import { setupRoutes } from './routes';
import { setupWebSocket } from './websocket';
import { connectDatabase } from './database';
import { setupRedis } from './cache';
import { logger } from './utils/logger';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Setup routes and WebSocket handlers
setupRoutes(app);
setupWebSocket(wss);

// Initialize database and cache
const init = async () => {
  try {
    await connectDatabase();
    await setupRedis();

    server.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

init();
