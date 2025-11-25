import express from 'express';
import {
  getMe,
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

// Current authenticated user
router.get('/me', getMe);

// CRUD routes
router.get('/', getUsers);          // Admin only
router.post('/', createUser);       // Admin only
router.get('/:id', getUserById);    // Admin or owner
router.put('/:id', updateUserById); // Admin or owner
router.delete('/:id', deleteUserById); // Admin or owner

export default router;

