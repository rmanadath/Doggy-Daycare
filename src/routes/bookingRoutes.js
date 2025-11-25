import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", auth, getAllBookings);
router.get("/:id", auth, getBookingById);
router.post("/", auth, createBooking);
router.put("/:id", auth, updateBooking);
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
 */
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", auth, deleteBooking);

export default router;