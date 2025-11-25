import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getUsers, getUserById, updateUser, deleteUser, getMe, createUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authenticate, getMe);

router.get('/', authenticate, getUsers);         // admin
router.get('/:id', authenticate, getUserById);  // admin or owner
router.post('/', authenticate, createUser);     // admin creates users (optional)
router.put('/:id', authenticate, updateUser);   // owner or admin
router.delete('/:id', authenticate, deleteUser);// owner or admin

export default router;
