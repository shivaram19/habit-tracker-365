import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { logsService } from '../services/logsService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('item_id').notEmpty(),
    body('category').notEmpty(),
    body('logged_at').isISO8601(),
    body('notes').optional(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { item_id, category, logged_at, notes } = req.body;
      const log = await logsService.createLog(
        req.userId!,
        item_id,
        category,
        new Date(logged_at),
        notes
      );

      res.status(201).json(log);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create log' });
    }
  }
);

router.get(
  '/',
  [
    query('start_date').optional().isISO8601(),
    query('end_date').optional().isISO8601(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
      const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

      const logs = await logsService.getLogs(req.userId!, startDate, endDate);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  }
);

router.put(
  '/:id',
  [
    body('category').optional(),
    body('logged_at').optional().isISO8601(),
    body('notes').optional(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const updates: any = {};
      if (req.body.category) updates.category = req.body.category;
      if (req.body.logged_at) updates.logged_at = new Date(req.body.logged_at);
      if (req.body.notes !== undefined) updates.notes = req.body.notes;

      const log = await logsService.updateLog(req.params.id, req.userId!, updates);
      res.json(log);
    } catch (error) {
      res.status(404).json({ error: 'Log not found' });
    }
  }
);

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    await logsService.deleteLog(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Log not found' });
  }
});

export default router;
