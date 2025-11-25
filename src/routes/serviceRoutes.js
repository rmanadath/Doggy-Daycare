/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Daycare services management
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 */

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The service data
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
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
 *       201:
 *         description: Service created
 */

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Service deleted
 *       404:
 *         description: Service not found
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
import { validateServiceData } from "../validators/serviceValidator.js";

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/services.controller");

// All routes here require authentication
router.get("/", auth, getAllServices);
router.get("/:id", auth, getServiceById);
router.post("/", auth, validateServiceData, createService);
router.put("/:id", auth, validateServiceData, updateService);
router.delete("/:id", auth, deleteService);

module.exports = router;