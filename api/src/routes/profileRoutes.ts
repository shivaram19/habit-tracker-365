import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { profileService } from '../services/profileService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    let profile = await profileService.getProfile(req.userId!);

    if (!profile) {
      profile = await profileService.createProfile(req.userId!);
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put(
  '/',
  [
    body('display_name').optional(),
    body('avatar_url').optional().isURL(),
    body('theme').optional().isIn(['light', 'dark', 'system']),
    body('divider_position').optional().isInt({ min: 0, max: 100 }),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const updates: any = {};
      if (req.body.display_name !== undefined) updates.display_name = req.body.display_name;
      if (req.body.avatar_url !== undefined) updates.avatar_url = req.body.avatar_url;
      if (req.body.theme) updates.theme = req.body.theme;
      if (req.body.divider_position !== undefined) updates.divider_position = req.body.divider_position;

      const profile = await profileService.updateProfile(req.userId!, updates);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

export default router;
