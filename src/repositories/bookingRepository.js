import prisma from "../prismaClient.js";

/**
 * Get all bookings
 */
export const getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      dog: {
        select: {
          id: true,
          name: true,
          breed: true,
        },
      },
    },
  });
};

/**
 * Get booking by ID
 */
export const getBookingById = async (id) => {
  return await prisma.booking.findUnique({
    where: { id: parseInt(id) },
    include: {
      dog: {
        select: {
          id: true,
          name: true,
          breed: true,
        },
      },
    },
  });
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  return await prisma.booking.create({
    data: {
      dogId: parseInt(bookingData.dogId),
      date: new Date(bookingData.date),
      checkInTime: new Date(bookingData.checkInTime),
      checkOutTime: new Date(bookingData.checkOutTime),
      status: bookingData.status || 'PENDING',
    },
    include: {
      dog: {
        select: {
          id: true,
          name: true,
          breed: true,
        },
      },
    },
  });
};

/**
 * Update a booking
 */
export const updateBooking = async (id, bookingData) => {
  const updateData = {};
  if (bookingData.date) updateData.date = new Date(bookingData.date);
  if (bookingData.checkInTime) updateData.checkInTime = new Date(bookingData.checkInTime);
  if (bookingData.checkOutTime) updateData.checkOutTime = new Date(bookingData.checkOutTime);
  if (bookingData.status) updateData.status = bookingData.status;

  return await prisma.booking.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      dog: {
        select: {
          id: true,
          name: true,
          breed: true,
        },
      },
    },
  });
};

/**
 * Delete a booking
 */
export const deleteBooking = async (id) => {
  return await prisma.booking.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Create many BookingService rows for a booking.
 * servicesInput = [{ serviceId, quantity }]
 */
export const addServicesToBooking = async (bookingId, servicesInput) => {
  if (!servicesInput || servicesInput.length === 0) return [];

  return await prisma.bookingService.createMany({
    data: servicesInput.map(s => ({
      bookingId,
      serviceId: parseInt(s.serviceId),
      quantity: s.quantity ?? 1,
    })),
    skipDuplicates: true, // because of composite PK @@id([bookingId, serviceId])
  });
};

/**
 * Remove all services from a booking
 */
export const clearServicesForBooking = async (bookingId) => {
  return await prisma.bookingService.deleteMany({
    where: { bookingId: parseInt(bookingId) },
  });
};

/**
 * Update quantity for one service on a booking
 */
export const updateBookingServiceQuantity = async (bookingId, serviceId, quantity) => {
  return await prisma.bookingService.update({
    where: {
      bookingId_serviceId: {
        bookingId: parseInt(bookingId),
        serviceId: parseInt(serviceId),
      },
    },
    data: { quantity },
  });
};

/**
 * Fetch booking services with service details
 */
export const getServicesForBooking = async (bookingId) => {
  return await prisma.bookingService.findMany({
    where: { bookingId: parseInt(bookingId) },
    include: {
      service: true,
    },
  });
};
