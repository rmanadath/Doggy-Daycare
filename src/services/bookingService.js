import * as bookingRepository from "../repositories/bookingRepository.js";

/**
 * Get all bookings (without services)
 */
export const getAllBookings = async () => {
  return await bookingRepository.getAllBookings();
};

/**
 * Get booking by ID
 */
export const getBookingById = async (id) => {
  const booking = await bookingRepository.getBookingById(id);
  if (!booking) throw new Error("Booking not found");
  return booking;
};

/**
 * Create booking (metadata only)
 */
export const createBooking = async (bookingData, userId) => {
  if (!userId) throw new Error("Unauthorized");

  return await bookingRepository.createBooking({
    dogId: bookingData.dogId,
    date: bookingData.date,
    checkInTime: bookingData.checkInTime,
    checkOutTime: bookingData.checkOutTime,
    status: "PENDING",
  });
};

/**
 * Update booking info (not services)
 */
export const updateBooking = async (id, bookingData, userId) => {
  if (!userId) throw new Error("Unauthorized");

  const exists = await bookingRepository.getBookingById(id);
  if (!exists) throw new Error("Booking not found");

  return await bookingRepository.updateBooking(id, {
    ...(bookingData.date && { date: bookingData.date }),
    ...(bookingData.checkInTime && { checkInTime: bookingData.checkInTime }),
    ...(bookingData.checkOutTime && { checkOutTime: bookingData.checkOutTime }),
    ...(bookingData.status && { status: bookingData.status }),
  });
};

/**
 * Delete booking
 */
export const deleteBooking = async (id, userId) => {
  if (!userId) throw new Error("Unauthorized");

  const exists = await bookingRepository.getBookingById(id);
  if (!exists) throw new Error("Booking not found");

  return await bookingRepository.deleteBooking(id);
};
