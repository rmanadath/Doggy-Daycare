import * as bookingService from "../services/bookingService.js";
import * as bookingLinkService from "../services/bookingServiceLinkService.js";

export const getAllBookings = async (req, res, next) => {
  try {
    const { id: userId, role: userRole } = req.user;
    const bookings = await bookingService.getAllBookings(userId, userRole);

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

export const getBookingById = async (req, res, next) => {
  try {
    const { id: userId, role: userRole } = req.user;
    const booking = await bookingService.getBookingById(req.params.id, userId, userRole);

    const { services, grandTotal } =
      await bookingLinkService.getBookingServicesSummary(booking.id);

    res.json({ ...booking, services, grandTotal });
  } catch (err) {
    if (err.message === "Booking not found") {
      return res.status(404).json({ error: err.message });
    }
    if (err.message === "Forbidden") {
      return res.status(403).json({ error: err.message });
    }
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { id: userId, role: userRole } = req.user;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const booking = await bookingService.createBooking(req.body, userId, userRole);

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
    if (err.message.includes("service") || err.message.includes("required") || 
        err.message.includes("past") || err.message.includes("time") || 
        err.message.includes("booked") || err.message.includes("Dog not found")) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message.includes("only create bookings")) {
      return res.status(403).json({ error: err.message });
    }
    if (err.message.includes("already booked")) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { id: userId, role: userRole } = req.user;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const updatedBooking = await bookingService.updateBooking(
      req.params.id,
      req.body,
      userId,
      userRole
    );

    let servicesSummary;
    if (req.body.services) {
      servicesSummary =
        await bookingLinkService.attachServicesToBooking(
          updatedBooking.id,
          req.body.services
        );
    } else {
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
    if (err.message === "Forbidden") {
      return res.status(403).json({ error: err.message });
    }
    if (err.message.includes("Invalid status") || err.message.includes("time")) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message.includes("already booked")) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id: userId, role: userRole } = req.user;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await bookingService.deleteBooking(req.params.id, userId, userRole);

    res.status(204).send();
  } catch (err) {
    if (err.message === "Booking not found") {
      return res.status(404).json({ error: err.message });
    }
    if (err.message === "Forbidden") {
      return res.status(403).json({ error: err.message });
    }
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id: userId, role: userRole } = req.user;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedBooking = await bookingService.updateBooking(
      req.params.id,
      { status },
      userId,
      userRole
    );

    const { services, grandTotal } =
      await bookingLinkService.getBookingServicesSummary(updatedBooking.id);

    return res.json({
      ...updatedBooking,
      services,
      grandTotal,
    });
  } catch (err) {
    if (err.message === "Booking not found") {
      return res.status(404).json({ error: err.message });
    }
    if (err.message === "Forbidden") {
      return res.status(403).json({ error: err.message });
    }
    if (err.message.includes("Invalid status")) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};