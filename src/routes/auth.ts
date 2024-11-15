import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} from '../schemas/auth';
import {
  login,
  register,
  refreshToken,
  logout,
} from '../controllers/auth';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', validateRequest(refreshTokenSchema), refreshToken);
router.post('/logout', authenticate, logout);

export default router;