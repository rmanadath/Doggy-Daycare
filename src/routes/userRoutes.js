import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getUsers);                 // Admin only
router.post('/', createUser);              // Admin only
router.get('/:id', getUserById);           // Admin or owner
router.put('/:id', updateUserById);        // Admin or owner
router.delete('/:id', deleteUserById);     // Admin or owner

export default router;

