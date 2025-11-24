import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

/**
 * Create Booking
 * Includes:
 * - Validate dog exists
 * - Validate dog belongs to current user (optional)
 * - Validate services
 * - Insert into BookingService (junction table)
 * - Calculate grandTotal
 */
export const createBooking = async (req, res) => {
  const { dogId, date, checkInTime, checkOutTime, notes, services } = req.body;

  try {
    // 1. Validate dog exists
    const dog = await prisma.dog.findUnique({
      where: { id: dogId },
      include: { owner: true },
    });

    if (!dog) {
      return res.status(404).json({ error: "Dog not found." });
    }

    // OPTIONAL but recommended:
    // Prevent users booking other people's dogs
    if (dog.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You cannot book for a dog you do not own." });
    }

    // 2. Create base booking record
    const booking = await prisma.booking.create({
      data: {
        dogId,
        date: new Date(date),
        checkInTime: new Date(checkInTime),
        checkOutTime: new Date(checkOutTime),
        notes: notes || "",
      },
    });

    // 3. Initialize total price
    let grandTotal = 0;

    // 4. Insert services through junction table
    if (Array.isArray(services)) {
      for (const svc of services) {
        const service = await prisma.service.findUnique({
          where: { id: svc.serviceId },
        });

        if (!service) {
          return res.status(400).json({
            error: `Invalid service ID: ${svc.serviceId}`,
          });
        }

        const quantity = svc.quantity ?? 1;

        // Add junction table record
        await prisma.bookingService.create({
          data: {
            bookingId: booking.id,
            serviceId: svc.serviceId,
            quantity,
          },
        });

        // Accumulate service cost
        grandTotal += Number(service.price) * quantity;
      }
    }

    // 5. Update booking with total
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { grandTotal },
      include: {
        dog: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    res.status(201).json(updatedBooking);
  } catch (error) {
    console.error("Booking Creation Error:", error);
    res.status(500).json({ error: "Failed to create booking." });
  }
};

/**
 * Get All Bookings
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        dog: true,
        services: { include: { service: true } },
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
};

/**
 * Get Booking by ID
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        dog: true,
        services: { include: { service: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking." });
  }
};

/**
 * Update Booking
 * - Update base booking info
 * - Remove old junction table links
 * - Re-add new services
 * - Recalculate total
 */
export const updateBooking = async (req, res) => {
  const { date, checkInTime, checkOutTime, notes, services } = req.body;

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    // Update base fields
    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        date: date ? new Date(date) : existingBooking.date,
        checkInTime: checkInTime
          ? new Date(checkInTime)
          : existingBooking.checkInTime,
        checkOutTime: checkOutTime
          ? new Date(checkOutTime)
          : existingBooking.checkOutTime,
        notes: notes ?? existingBooking.notes,
      },
    });

    // Remove old service links
    await prisma.bookingService.deleteMany({
      where: { bookingId: updatedBooking.id },
    });

    let grandTotal = 0;

    // Re-add services
    if (Array.isArray(services)) {
      for (const svc of services) {
        const service = await prisma.service.findUnique({
          where: { id: svc.serviceId },
        });

        if (!service) {
          return res.status(400).json({
            error: `Invalid service ID: ${svc.serviceId}`,
          });
        }

        const quantity = svc.quantity ?? 1;

        await prisma.bookingService.create({
          data: {
            bookingId: updatedBooking.id,
            serviceId: svc.serviceId,
            quantity,
          },
        });

        grandTotal += Number(service.price) * quantity;
      }
    }

    // Update total
    const finalBooking = await prisma.booking.update({
      where: { id: updatedBooking.id },
      data: { grandTotal },
      include: {
        dog: true,
        services: { include: { service: true } },
      },
    });

    res.json(finalBooking);
  } catch (error) {
    console.error("Booking Update Error:", error);
    res.status(500).json({ error: "Failed to update booking." });
  }
};

/**
 * Delete Booking
 */
export const deleteBooking = async (req, res) => {
  try {
    await prisma.bookingService.deleteMany({
      where: { bookingId: req.params.id },
    });

    await prisma.booking.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Booking Delete Error:", error);
    res.status(500).json({ error: "Failed to delete booking." });
  }
};