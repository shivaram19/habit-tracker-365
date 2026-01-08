import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { profileService } from '../services/profileService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authService } from '../services/authService';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    let profile = await profileService.getProfile(req.userId!);

    if (!profile) {
      const user = await authService.getUser(req.userId!);
      profile = await profileService.createProfile(req.userId!, user.email);
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put(
  '/',
  [
    body('name').optional(),
    body('timezone').optional(),
    body('theme_preference').optional().isIn(['light', 'dark', 'system']),
    body('divider_position').optional().isInt({ min: 0, max: 200 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const updates: any = {};
      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.timezone !== undefined) updates.timezone = req.body.timezone;
      if (req.body.theme_preference) updates.theme_preference = req.body.theme_preference;
      if (req.body.divider_position !== undefined) updates.divider_position = req.body.divider_position;

      const profile = await profileService.updateProfile(req.userId!, updates);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

export default router;
