import express from 'express';
import * as dogController from '../controllers/dogController.js';
// TODO: Import auth middleware when available
// import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication (uncomment when auth middleware is ready)
// router.use(authenticate);

// GET /dogs - Get all dogs
router.get('/', dogController.getAllDogs);

// GET /dogs/:id - Get dog by ID
router.get('/:id', dogController.getDogById);

// POST /dogs - Create new dog
router.post('/', dogController.createDog);

// PUT /dogs/:id - Update dog
router.put('/:id', dogController.updateDog);

// DELETE /dogs/:id - Delete dog
router.delete('/:id', dogController.deleteDog);

export default router;

