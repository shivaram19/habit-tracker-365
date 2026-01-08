import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from '../services/authService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;
      const result = await authService.signup(email, password);

      res.status(201).json(result);
    } catch (error) {
      if ((error as Error).message.includes('duplicate key')) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }
      res.status(500).json({ error: 'Signup failed' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }
);

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getUser(req.userId!);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

export default router;
