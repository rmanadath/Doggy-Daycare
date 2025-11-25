import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", auth, getAllBookings);
router.get("/:id", auth, getBookingById);
router.post("/", auth, createBooking);
router.put("/:id", auth, updateBooking);
router.delete("/:id", auth, deleteBooking);

export default router;