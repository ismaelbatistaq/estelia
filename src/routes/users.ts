import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
  createUserSchema,
  updateUserSchema,
} from '../schemas/user';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN'), getUsers);
router.get('/:id', getUser);
router.post('/', authorize('ADMIN'), validateRequest(createUserSchema), createUser);
router.put('/:id', validateRequest(updateUserSchema), updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);

export default router;