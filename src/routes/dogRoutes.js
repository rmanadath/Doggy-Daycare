/**
 * @swagger
 * tags:
 *   name: Dogs
 *   description: Dog management endpoints
 */

import express from 'express';
import * as dogController from '../controllers/dogController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /dogs:
 *   get:
 *     summary: Get all dogs
 *     tags: [Dogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all dogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   breed:
 *                     type: string
 *                   ownerId:
 *                     type: integer
 */
router.get('/', dogController.getAllDogs);

/**
 * @swagger
 * /dogs/{id}:
 *   get:
 *     summary: Get dog by ID
 *     tags: [Dogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dog details
 *       404:
 *         description: Dog not found
 */
router.get('/:id', dogController.getDogById);

/**
 * @swagger
 * /dogs:
 *   post:
 *     summary: Create a new dog
 *     tags: [Dogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - breed
 *             properties:
 *               name:
 *                 type: string
 *               breed:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dog created successfully
 *       400:
 *         description: Name and breed are required
 */
router.post('/', dogController.createDog);

/**
 * @swagger
 * /dogs/{id}:
 *   put:
 *     summary: Update dog information
 *     tags: [Dogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               breed:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dog updated successfully
 *       404:
 *         description: Dog not found
 *       403:
 *         description: Unauthorized - not the owner
 */
router.put('/:id', dogController.updateDog);

/**
 * @swagger
 * /dogs/{id}:
 *   delete:
 *     summary: Delete a dog
 *     tags: [Dogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Dog deleted successfully
 *       404:
 *         description: Dog not found
 *       403:
 *         description: Unauthorized - not the owner
 */
router.delete('/:id', dogController.deleteDog);

export default router;
