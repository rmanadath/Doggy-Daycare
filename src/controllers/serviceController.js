const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// GET all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    return res.json(services);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch services." });
  }
};

// GET service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }

    return res.json(service);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch service." });
  }
};

// POST create service
exports.createService = async (req, res) => {
  const { name, description, price, active } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!price || Number(price) <= 0) {
    return res.status(400).json({ error: "Price must be greater than 0." });
  }

  try {
    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price,
        active: active ?? true,
      },
    });

    return res.status(201).json(newService);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create service." });
  }
};

// PUT update service
exports.updateService = async (req, res) => {
  const { name, description, price, active } = req.body;

  if (price !== undefined && Number(price) <= 0) {
    return res.status(400).json({ error: "Price must be greater than 0." });
  }

  try {
    const updatedService = await prisma.service.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        price,
        active,
      },
    });

    return res.json(updatedService);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Service not found." });
    }
    return res.status(500).json({ error: "Failed to update service." });
  }
};

// DELETE service
exports.deleteService = async (req, res) => {
  try {
    await prisma.service.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Service not found." });
    }
    return res.status(500).json({ error: "Failed to delete service." });
  }
};