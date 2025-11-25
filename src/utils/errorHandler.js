export const handleServiceError = (err, res, next) => {
  if (err.message === "Booking not found") {
    return res.status(404).json({ error: err.message });
  }
  
  if (err.message === "Forbidden") {
    return res.status(403).json({ error: err.message });
  }

  if (err.message === "Dog not found") {
    return res.status(404).json({ error: err.message });
  }

  if (
    err.message.includes("service") ||
    err.message.includes("required") ||
    err.message.includes("past") ||
    err.message.includes("time") ||
    err.message.includes("Invalid status") ||
    err.message.includes("quantity")
  ) {
    return res.status(400).json({ error: err.message });
  }

  if (
    err.message.includes("only create bookings") ||
    err.message.includes("only update") ||
    err.message.includes("only delete")
  ) {
    return res.status(403).json({ error: err.message });
  }

  if (err.message.includes("already booked")) {
    return res.status(409).json({ error: err.message });
  }

  // Unknown error - pass to global handler
  next(err);
};