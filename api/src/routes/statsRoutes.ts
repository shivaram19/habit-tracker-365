import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { statsService } from '../services/statsService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  [query('year').optional().isInt({ min: 2000, max: 2100 })],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const stats = await statsService.getStats(req.userId!, year);

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
);

export default router;
