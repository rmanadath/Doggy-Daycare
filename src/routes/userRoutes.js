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

// Current logged-in user
router.get('/me', async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', getUsers);                 
router.post('/', createUser);              
router.get('/:id', getUserById);           
router.put('/:id', updateUserById);        
router.delete('/:id', deleteUserById);     

export default router;
