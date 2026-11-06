import { Router } from 'express';
import { profile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.get('/profile', protect, profile);
router.put('/profile', protect, updateProfile);
export default router;
