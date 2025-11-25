const serviceService = require('../services/serviceService.js');

/**
 * GET /services
 */
exports.getAllServices = async (req, res, next) => {
  try {
    const services = await serviceService.getAllServices();
    res.json(services);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /services/:id
 */
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    res.json(service);
  } catch (error) {
    if (error.message === 'Service not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * POST /services
 */
exports.createService = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const created = await serviceService.createService(req.body, userId);
    res.status(201).json(created);
  } catch (error) {
    if (
      error.message === 'Unauthorized' ||
      error.message === 'Service name is required and must be a non-empty string.'
    ) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * PUT /services/:id
 */
exports.updateService = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const updated = await serviceService.updateService(req.params.id, req.body, userId);
    res.json(updated);
  } catch (error) {
    if (error.message === 'Service not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * DELETE /services/:id
 */
exports.deleteService = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    await serviceService.deleteService(req.params.id, userId);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Service not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};
