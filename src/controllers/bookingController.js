import * as bookingService from "../services/bookingService.js";
import * as bookingLinkService from "../services/bookingServiceLinkService.js";

/**
 * GET /bookings
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();

    // attach services + totals
    const enriched = await Promise.all(
      bookings.map(async (b) => {
        const { services, grandTotal } =
          await bookingLinkService.getBookingServicesSummary(b.id);
        return { ...b, services, grandTotal };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /bookings/:id
 */
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);

    const { services, grandTotal } =
      await bookingLinkService.getBookingServicesSummary(booking.id);

    res.json({ ...booking, services, grandTotal });
  } catch (err) {
    if (err.message === "Booking not found") {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

/**
 * POST /bookings
 */
export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // 1. Make booking row
    const booking = await bookingService.createBooking(req.body, userId);

    // 2. Attach services
    const { services, grandTotal } =
      await bookingLinkService.attachServicesToBooking(
        booking.id,
        req.body.services
      );

    return res.status(201).json({
      ...booking,
      services,
      grandTotal,
    });
  } catch (err) {
    if (err.message.includes("service")) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

/**
 * PUT /bookings/:id
 */
export const updateBooking = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // 1. Update booking metadata
    const updatedBooking = await bookingService.updateBooking(
      req.params.id,
      req.body,
      userId
    );

    // 2. If services included → replace all services
    let servicesSummary;
    if (req.body.services) {
      servicesSummary =
        await bookingLinkService.attachServicesToBooking(
          updatedBooking.id,
          req.body.services
        );
    } else {
      // otherwise keep existing services
      servicesSummary =
        await bookingLinkService.getBookingServicesSummary(updatedBooking.id);
    }

    return res.json({
      ...updatedBooking,
      ...servicesSummary,
    });
  } catch (err) {
    if (err.message === "Booking not found") {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

/**
 * DELETE /bookings/:id
 */
export const deleteBooking = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await bookingService.deleteBooking(req.params.id, userId);

    res.status(204).send();
  } catch (err) {
    if (err.message === "Booking not found") {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};
