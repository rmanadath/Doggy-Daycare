import prisma from "../prismaClient.js";

import {
  addServicesToBooking,
  clearServicesForBooking,
  getServicesForBooking,
} from "../repositories/bookingRepository.js";

/**
 * Attach services to a booking.
 * services = [{ serviceId, quantity }]
 */
export const attachServicesToBooking = async (bookingId, services) => {
  if (!services || services.length === 0) {
    return { services: [], grandTotal: 0 };
  }

  // normalize input
  const normalized = services.map(s => ({
    serviceId: parseInt(s.serviceId),
    quantity: s.quantity ?? 1,
  }));

  // validate ids + quantities
  for (const s of normalized) {
    if (!s.serviceId || Number.isNaN(s.serviceId)) {
      throw new Error("Invalid serviceId");
    }
    if (!Number.isInteger(s.quantity) || s.quantity <= 0) {
      throw new Error("Quantity must be a positive integer");
    }
  }

  // validate that services exist
  const serviceIds = normalized.map(s => s.serviceId);
  const records = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
  });

  if (records.length !== serviceIds.length) {
    throw new Error("One or more services not found");
  }

  // wipe existing rows & insert new
  await clearServicesForBooking(bookingId);
  await addServicesToBooking(bookingId, normalized);

  // return joined + totals
  return await getBookingServicesSummary(bookingId);
};

/**
 * Returns list of services for a booking and total price.
 */
export const getBookingServicesSummary = async (bookingId) => {
  const joined = await getServicesForBooking(bookingId);

  let grandTotal = 0;

  const services = joined.map(j => {
    const unitPrice = Number(j.service.price);
    const totalPrice = unitPrice * j.quantity;

    grandTotal += totalPrice;

    return {
      serviceId: j.serviceId,
      name: j.service.name,
      quantity: j.quantity,
      unitPrice,
      totalPrice,
    };
  });

  grandTotal = Math.round(grandTotal * 100) / 100;

  return { services, grandTotal };
};
