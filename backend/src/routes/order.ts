import { Router, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import { redisClient } from '../cache';

const router = Router();

// Apply authentication middleware to all order routes
router.use(authenticateToken);

// Place a new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { symbol, side, type, quantity, price } = req.body;
    const userId = (req as AuthenticatedRequest).user!.id;

    // Validate order parameters
    if (!symbol || !side || !type || !quantity) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    if (type === 'limit' && !price) {
      return res.status(400).json({ message: 'Price is required for limit orders' });
    }

    // TODO: Implement actual order placement logic with exchange API
    const order = {
      id: Math.random().toString(36).substring(7),
      userId,
      symbol,
      side,
      type,
      quantity,
      price,
      status: 'pending',
      createdAt: new Date()
    };

    // Store order in Redis for quick access
    await redisClient.hSet(`orders:${userId}`, order.id, JSON.stringify(order));

    res.status(201).json(order);
  } catch (error) {
    logger.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user!.id;
    const { status, symbol } = req.query;

    // Get all orders for the user from Redis
    const ordersMap = await redisClient.hGetAll(`orders:${userId}`);
    let orders = Object.values(ordersMap).map(order => JSON.parse(order));

    // Apply filters if provided
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    if (symbol) {
      orders = orders.filter(order => order.symbol === symbol);
    }

    res.json(orders);
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get order by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user!.id;
    const orderId = req.params.id;

    const order = await redisClient.hGet(`orders:${userId}`, orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(JSON.parse(order));
  } catch (error) {
    logger.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel order
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user!.id;
    const orderId = req.params.id;

    const order = await redisClient.hGet(`orders:${userId}`, orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const parsedOrder = JSON.parse(order);
    if (parsedOrder.status === 'filled' || parsedOrder.status === 'cancelled') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // TODO: Implement actual order cancellation logic with exchange API
    parsedOrder.status = 'cancelled';
    await redisClient.hSet(`orders:${userId}`, orderId, JSON.stringify(parsedOrder));

    res.json(parsedOrder);
  } catch (error) {
    logger.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
