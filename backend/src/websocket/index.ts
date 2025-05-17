import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';
import { verifyToken } from '../utils/auth';
import { logger } from '../utils/logger';

interface WebSocketClient extends WebSocket {
  isAlive: boolean;
  userId?: string;
}

interface WebSocketMessage {
  type: string;
  payload: any;
}

export const setupWebSocket = (server: Server) => {
  const HEARTBEAT_INTERVAL = 30000;
  const CLIENT_TIMEOUT = 35000;
  const wss = new WebSocketServer({ server });

  const heartbeat = (ws: WebSocketClient) => {
    ws.isAlive = true;
  };

  const checkConnections = () => {
    wss.clients.forEach((client: WebSocket) => {
      const ws = client as WebSocketClient;
      if (!ws.isAlive) {
        logger.info(`Terminating inactive client: ${ws.userId}`);
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  };

  const interval = setInterval(checkConnections, HEARTBEAT_INTERVAL);

  wss.on('close', () => {
    clearInterval(interval);
  });

  wss.on('connection', async (ws: WebSocketClient, req) => {
    try {
      // Extract token from query parameters
      const url = new URL(req.url || '', 'ws://localhost');
      const token = url.searchParams.get('token');

      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      // Verify token
      const user = await verifyToken(token);
      if (!user) {
        ws.close(1008, 'Invalid token');
        return;
      }

      // Initialize WebSocket client
      ws.isAlive = true;
      ws.userId = user.id;

      // Set up heartbeat
      ws.on('pong', () => heartbeat(ws));

      (ws as any).user = user;

      logger.info(`Client connected: ${user.id}`);

      // Handle incoming messages
      ws.on('message', async (message: WebSocket.RawData) => {
        try {
          const data = JSON.parse(message.toString()) as WebSocketMessage;
          handleWebSocketMessage(ws, data);
        } catch (error) {
          logger.error('Error handling WebSocket message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });

      // Handle client disconnection
      ws.on('close', () => {
        logger.info(`Client disconnected: ${user.id}`);
      });

    } catch (error) {
      logger.error('WebSocket connection error:', error);
      ws.close(1011, 'Internal server error');
    }
  });
};

const handleWebSocketMessage = (ws: WebSocketClient, data: WebSocketMessage) => {
  const { type, payload } = data;

  switch (type) {
    case 'subscribe':
      handleSubscription(ws, data.payload as string[]);
      break;
    case 'unsubscribe':
      handleUnsubscription(ws, payload);
      break;
    case 'order':
      handleOrder(ws, payload);
      break;
    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Unknown message type'
      }));
  }
};

const handleSubscription = (ws: WebSocketClient, channels: string[]) => {
  // Implement subscription logic
  logger.info('Subscription request:', channels);
};

const handleUnsubscription = (ws: WebSocketClient, channels: string[]) => {
  // Implement unsubscription logic
  logger.info('Unsubscription request:', channels);
};

interface OrderPayload {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  quantity: number;
  price?: number;
}

const handleOrder = (ws: WebSocketClient, payload: OrderPayload) => {
  // Implement order handling logic
  logger.info('Order request:', payload);
};
