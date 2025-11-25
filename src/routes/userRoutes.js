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

// All routes require authentication
router.use(authenticate);

// Current user
router.get('/me', getMe);

// Admin-only / all CRUD
router.get('/', getUsers);          
router.post('/', createUser);       
router.get('/:id', getUserById);    
router.put('/:id', updateUserById); 
router.delete('/:id', deleteUserById);

export default router;

