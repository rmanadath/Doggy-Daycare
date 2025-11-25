import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

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
