import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup); // POST /auth/signup
router.post('/login', login);   // POST /auth/login

export default router;
