/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management endpoints
 */

import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   dogId:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   checkInTime:
 *                     type: string
 *                     format: date-time
 *                   checkOutTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 */
router.get("/", getAllBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
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
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get("/:id", getBookingById);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dogId
 *               - date
 *               - checkInTime
 *               - checkOutTime
 *             properties:
 *               dogId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-10"
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-10T08:00:00Z"
 *               checkOutTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-10T17:30:00Z"
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     serviceId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *           example:
 *             dogId: 1
 *             date: "2025-05-10"
 *             checkInTime: "2025-05-10T08:00:00Z"
 *             checkOutTime: "2025-05-10T17:30:00Z"
 *             services:
 *               - serviceId: 1
 *                 quantity: 1
 *               - serviceId: 4
 *                 quantity: 1
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 dogId:
 *                   type: integer
 *                   example: 1
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-05-10"
 *                 checkInTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-10T08:00:00Z"
 *                 checkOutTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-10T17:30:00Z"
 *                 status:
 *                   type: string
 *                   example: "PENDING"
 *       400:
 *         description: Invalid input
 */
router.post("/", createBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
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
 *               date:
 *                 type: string
 *                 format: date
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *               checkOutTime:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking not found
 */
router.put("/:id", updateBooking);

/**
 * @swagger
 * /bookings/{id}/status:
 *   patch:
 *     summary: Update booking status only
 *     tags: [Bookings]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Booking not found
 */
router.patch("/:id/status", updateBookingStatus);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
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
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", deleteBooking);

export default router;
