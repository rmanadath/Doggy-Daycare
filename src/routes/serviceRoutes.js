/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Daycare services management
 */

import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as serviceController from '../controllers/serviceController.js';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all services
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
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   active:
 *                     type: boolean
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
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
 *         description: Service details
 *       404:
 *         description: Service not found
 */
router.get('/:id', serviceController.getServiceById);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Full Day"
 *               description:
 *                 type: string
 *                 example: "Full day daycare service"
 *               price:
 *                 type: number
 *                 example: 45.00
 *               active:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *           example:
 *             name: "Full Day"
 *             description: "Full day daycare service"
 *             price: 45.00
 *             active: true
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Full Day"
 *                 description:
 *                   type: string
 *                   example: "Full day daycare service"
 *                 price:
 *                   type: number
 *                   example: 45.00
 *                 active:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid input
 */
router.post('/', serviceController.createService);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 */
router.put('/:id', serviceController.updateService);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
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
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */
router.delete('/:id', serviceController.deleteService);

export default router;
