import { Router } from 'express';
import { AppDataSource } from '../database';
import { Bot } from '../entities/Bot';
import { logger } from '../utils/logger';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all bot routes
router.use(authenticateToken);

// Get all bots for the authenticated user
router.get('/', async (req, res) => {
  try {
    const botRepository = AppDataSource.getRepository(Bot);
    const bots = await botRepository.find({
      where: { userId: (req as any).user.id }
    });
    res.json(bots);
  } catch (error) {
    logger.error('Error fetching bots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new bot
router.post('/', async (req, res) => {
  try {
    const { name, strategy, config } = req.body;
    const botRepository = AppDataSource.getRepository(Bot);

    const bot = botRepository.create({
      name,
      strategy,
      config,
      userId: (req as any).user.id,
      status: 'stopped'
    });

    await botRepository.save(bot);
    res.status(201).json(bot);
  } catch (error) {
    logger.error('Error creating bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get bot by ID
router.get('/:id', async (req, res) => {
  try {
    const botRepository = AppDataSource.getRepository(Bot);
    const bot = await botRepository.findOne({
      where: {
        id: req.params.id,
        userId: (req as any).user.id
      }
    });

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    res.json(bot);
  } catch (error) {
    logger.error('Error fetching bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update bot
router.put('/:id', async (req, res) => {
  try {
    const { name, strategy, config } = req.body;
    const botRepository = AppDataSource.getRepository(Bot);
    
    const bot = await botRepository.findOne({
      where: {
        id: req.params.id,
        userId: (req as any).user.id
      }
    });

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    bot.name = name;
    bot.strategy = strategy;
    bot.config = config;

    await botRepository.save(bot);
    res.json(bot);
  } catch (error) {
    logger.error('Error updating bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete bot
router.delete('/:id', async (req, res) => {
  try {
    const botRepository = AppDataSource.getRepository(Bot);
    const bot = await botRepository.findOne({
      where: {
        id: req.params.id,
        userId: (req as any).user.id
      }
    });

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    await botRepository.remove(bot);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start bot
router.post('/:id/start', async (req, res) => {
  try {
    const botRepository = AppDataSource.getRepository(Bot);
    const bot = await botRepository.findOne({
      where: {
        id: req.params.id,
        userId: (req as any).user.id
      }
    });

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    bot.status = 'running';
    await botRepository.save(bot);
    
    // TODO: Implement actual bot start logic
    
    res.json(bot);
  } catch (error) {
    logger.error('Error starting bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Stop bot
router.post('/:id/stop', async (req, res) => {
  try {
    const botRepository = AppDataSource.getRepository(Bot);
    const bot = await botRepository.findOne({
      where: {
        id: req.params.id,
        userId: (req as any).user.id
      }
    });

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    bot.status = 'stopped';
    await botRepository.save(bot);
    
    // TODO: Implement actual bot stop logic
    
    res.json(bot);
  } catch (error) {
    logger.error('Error stopping bot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
