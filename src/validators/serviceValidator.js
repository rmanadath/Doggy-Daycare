export const validateServiceData = (req, res, next) => {
  const { name, description, price, active } = req.body;

  // Validate name
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Service name is required and must be a non-empty string.",
    });
  }

  // Validate description (optional)
  if (description && typeof description !== "string") {
    return res.status(400).json({
      error: "Description must be a string.",
    });
  }

  if (description && description.length > 250) {
    return res.status(400).json({
      error: "Description cannot exceed 250 characters.",
    });
  }

  // Validate price
  if (price === undefined || price === null) {
    return res.status(400).json({
      error: "Price is required.",
    });
  }

  if (isNaN(Number(price)) || Number(price) <= 0) {
    return res.status(400).json({
      error: "Price must be a numeric value greater than 0.",
    });
  }

  // Validate active (optional)
  if (active !== undefined && typeof active !== "boolean") {
    return res.status(400).json({
      error: "Active must be a boolean value.",
    });
  }

  next();
};