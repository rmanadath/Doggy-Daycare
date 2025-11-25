/**
 * Validates that booking times to make sure they arent in the past
 * @param {string} date - Booking date
 * @param {string} checkInTime - Check-in datetime
 * @param {string} checkOutTime - Check-out datetime
 * @throws {Error} If validation fails
 */

import * as bookingRepo from '../repositories/bookingRepository.js';
import prisma from '../prismaClient.js';

const validateBookingTimes = (date, checkInTime, checkOutTime) => {
  const bookingDate = new Date(date);
  const checkIn = new Date(checkInTime);
  const checkOut = new Date(checkOutTime);
  const now = new Date();

  if (bookingDate < now.setHours(0, 0, 0, 0)) {
    throw new Error('Cannot book dates in the past');
  }

  if (checkOut <= checkIn) {
    throw new Error('Check-out time must be after check-in time');
  }
};

/**
 * Checks if a time slot is available for a specific dog
 * @param {string} dogId - Dog ID
 * @param {string} date - Booking date
 * @param {string} checkInTime - Check-in datetime
 * @param {string} checkOutTime - Check-out datetime
 * @param {string|null} excludeBookingId - Booking ID to exclude (for updates)
 * @throws {Error} If time slot is not available
 */

const checkTimeSlotAvailability = async (dogId, date, checkInTime, checkOutTime, excludeBookingId = null) => {
  const bookingDate = new Date(date);
  const checkIn = new Date(checkInTime);
  const checkOut = new Date(checkOutTime);

  const conflicting = await prisma.booking.findMany({
    where: {
      dogId: parseInt(dogId),
      date: bookingDate,
      status: { in: ['CONFIRMED', 'PENDING'] },
      id: excludeBookingId ? { not: parseInt(excludeBookingId) } : undefined,
      OR: [
        { AND: [{ checkInTime: { lte: checkIn } }, { checkOutTime: { gt: checkIn } }] },
        { AND: [{ checkInTime: { lt: checkOut } }, { checkOutTime: { gte: checkOut } }] },
        { AND: [{ checkInTime: { gte: checkIn } }, { checkOutTime: { lte: checkOut } }] }
      ]
    }
  });

  if (conflicting.length > 0) {
    throw new Error('This time slot is already booked for this dog');
  }
};

/**
 * Checks if a time slot is available for a specific dog
 * @param {string} dogId - Dog ID
 * @param {string} date - Booking date
 * @param {string} checkInTime - Check-in datetime
 * @param {string} checkOutTime - Check-out datetime
 * @param {string|null} excludeBookingId - Booking ID to exclude (for updates)
 * @throws {Error} If time slot is not available
 */

const checkDogOwnership = async (dogId, userId, userRole) => {
  const dog = await prisma.dog.findUnique({
    where: { id: parseInt(dogId) },
    select: { ownerId: true }
  });

  if (!dog) {
    throw new Error('Dog not found');
  }

  if (userRole !== 'admin' && dog.ownerId !== userId) {
    throw new Error('You can only create bookings for your own dogs');
  }
};

/**
 * Get all bookings filtered by user role
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {Promise<Array>} List of bookings
 */

export const getAllBookings = async (userId, userRole) => {
  if (userRole === 'admin') {
    return await bookingRepo.getAllBookings();
  }

  // Regular users: only their dogs' bookings
  const userDogs = await prisma.dog.findMany({
    where: { ownerId: userId },
    select: { id: true }
  });
  const dogIds = userDogs.map(d => d.id);

  return await prisma.booking.findMany({
    where: { dogId: { in: dogIds } },
    include: {
      dog: { select: { id: true, name: true, breed: true } }
    }
  });
};

/**
 * Get a specific booking by ID with authorization check
 * @param {string} id - Booking ID
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {Promise<Object>} Booking object
 * @throws {Error} If booking not found or user not authorized
 */

export const getBookingById = async (id, userId, userRole) => {
  const booking = await bookingRepo.getBookingById(id);
  if (!booking) throw new Error('Booking not found');

  // Check authorization
  if (userRole !== 'admin') {
    const dog = await prisma.dog.findUnique({
      where: { id: booking.dogId },
      select: { ownerId: true }
    });
    if (dog.ownerId !== userId) {
      throw new Error('Forbidden');
    }
  }

  return booking;
};

/**
 * Create a new booking with validation and authorization
 * @param {Object} bookingData - Booking data
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {Promise<Object>} Created booking
 * @throws {Error} If validation fails or user not authorized
 */

export const createBooking = async (bookingData, userId, userRole) => {
  const { dogId, date, checkInTime, checkOutTime } = bookingData;

  // Validate required fields
  if (!dogId || !date || !checkInTime || !checkOutTime) {
    throw new Error('Missing required fields: dogId, date, checkInTime, checkOutTime');
  }

  // Check dog ownership
  await checkDogOwnership(dogId, userId, userRole);

  // Validate times
  validateBookingTimes(date, checkInTime, checkOutTime);

  // Check availability
  await checkTimeSlotAvailability(dogId, date, checkInTime, checkOutTime);

  // Create booking with CONFIRMED status
  return await bookingRepo.createBooking({
    ...bookingData,
    status: 'CONFIRMED'
  });
};

/**
 * Update an existing booking with validation and authorization
 * @param {string} id - Booking ID
 * @param {Object} bookingData - Updated booking data
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {Promise<Object>} Updated booking
 * @throws {Error} If validation fails or user not authorized
 */

export const updateBooking = async (id, bookingData, userId, userRole) => {
  const existing = await bookingRepo.getBookingById(id);
  if (!existing) throw new Error('Booking not found');

  // Check authorization
  if (userRole !== 'admin') {
    const dog = await prisma.dog.findUnique({
      where: { id: existing.dogId },
      select: { ownerId: true }
    });
    if (dog.ownerId !== userId) {
      throw new Error('Forbidden');
    }
  }

  // Validate status if provided
  if (bookingData.status) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(bookingData.status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // Validate times if being updated
  if (bookingData.date || bookingData.checkInTime || bookingData.checkOutTime) {
    const newDate = bookingData.date || existing.date;
    const newCheckIn = bookingData.checkInTime || existing.checkInTime;
    const newCheckOut = bookingData.checkOutTime || existing.checkOutTime;

    validateBookingTimes(newDate, newCheckIn, newCheckOut);
    await checkTimeSlotAvailability(existing.dogId, newDate, newCheckIn, newCheckOut, id);
  }

  return await bookingRepo.updateBooking(id, bookingData);
};

/**
 * Delete a booking with authorization check
 * @param {string} id - Booking ID
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {Promise<void>}
 * @throws {Error} If booking not found or user not authorized
 */

export const deleteBooking = async (id, userId, userRole) => {
  const booking = await bookingRepo.getBookingById(id);
  if (!booking) throw new Error('Booking not found');

  // Check authorization
  if (userRole !== 'admin') {
    const dog = await prisma.dog.findUnique({
      where: { id: booking.dogId },
      select: { ownerId: true }
    });
    if (dog.ownerId !== userId) {
      throw new Error('Forbidden');
    }
  }

  return await bookingRepo.deleteBooking(id);
};
