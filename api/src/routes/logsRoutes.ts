import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { logsService } from '../services/logsService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post(
  '/days',
  [
    body('date').isISO8601(),
    body('hourly_logs').isArray(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { date, hourly_logs } = req.body;
      const day = await logsService.createDay(req.userId!, date, hourly_logs);

      res.status(201).json(day);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create day' });
    }
  }
);

router.get(
  '/days',
  [
    query('start_date').optional().isISO8601(),
    query('end_date').optional().isISO8601(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const startDate = req.query.start_date as string | undefined;
      const endDate = req.query.end_date as string | undefined;

      const days = await logsService.getDays(req.userId!, startDate, endDate);
      res.json(days);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch days' });
    }
  }
);

router.get(
  '/days/:date',
  async (req: AuthRequest, res: Response) => {
    try {
      const day = await logsService.getDay(req.userId!, req.params.date);
      if (!day) {
        res.status(404).json({ error: 'Day not found' });
        return;
      }
      res.json(day);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch day' });
    }
  }
);

router.put(
  '/days/:id',
  [
    body('hourly_logs').optional().isArray(),
    body('highlight').optional(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const updates: any = {};
      if (req.body.hourly_logs) updates.hourly_logs = req.body.hourly_logs;
      if (req.body.highlight !== undefined) updates.highlight = req.body.highlight;

      const day = await logsService.updateDay(req.params.id, req.userId!, updates);
      res.json(day);
    } catch (error) {
      res.status(404).json({ error: 'Day not found' });
    }
  }
);

router.delete('/days/:id', async (req: AuthRequest, res: Response) => {
  try {
    await logsService.deleteDay(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Day not found' });
  }
});

router.post(
  '/items',
  [
    body('day_id').notEmpty(),
    body('category').isInt(),
    body('name').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('date').isISO8601(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { day_id, category, name, price, date } = req.body;
      const item = await logsService.createListItem(day_id, req.userId!, {
        category,
        name,
        price,
        date,
      });

      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create list item' });
    }
  }
);

router.get(
  '/items/:day_id',
  async (req: AuthRequest, res: Response) => {
    try {
      const items = await logsService.getListItems(req.params.day_id, req.userId!);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch list items' });
    }
  }
);

router.put(
  '/items/:id',
  [
    body('category').optional().isInt(),
    body('name').optional(),
    body('price').optional().isFloat({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const updates: any = {};
      if (req.body.category !== undefined) updates.category = req.body.category;
      if (req.body.name) updates.name = req.body.name;
      if (req.body.price !== undefined) updates.price = req.body.price;

      const item = await logsService.updateListItem(req.params.id, req.userId!, updates);
      res.json(item);
    } catch (error) {
      res.status(404).json({ error: 'List item not found' });
    }
  }
);

router.delete('/items/:id', async (req: AuthRequest, res: Response) => {
  try {
    await logsService.deleteListItem(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'List item not found' });
  }
});

export default router;
