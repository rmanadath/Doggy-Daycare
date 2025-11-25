import * as serviceRepository from '../repositories/serviceRepository.js';

/**
 * Get all services
 */
export const getAllServices = async () => {
  return await serviceRepository.getAllServices();
};

/**
 * Get service by ID
 */
export const getServiceById = async (id) => {
  const service = await serviceRepository.getServiceById(id);
  if (!service) {
    throw new Error('Service not found');
  }
  return service;
};

/**
 * Create service
 */
export const createService = async (serviceData, userId) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const created = await serviceRepository.createService({
    name: serviceData.name,
    description: serviceData.description,
    price: Number(serviceData.price),
    active: serviceData.active ?? true,
  });

  return created;
};

/**
 * Update service
 */
export const updateService = async (id, serviceData, userId) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const existing = await serviceRepository.getServiceById(id);
  if (!existing) {
    throw new Error('Service not found');
  }

  return await serviceRepository.updateService(id, {
    ...serviceData,
    price: serviceData.price !== undefined ? Number(serviceData.price) : undefined,
  });
};

/**
 * Delete service
 */
export const deleteService = async (id, userId) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const existing = await serviceRepository.getServiceById(id);
  if (!existing) {
    throw new Error('Service not found');
  }

  return await serviceRepository.deleteService(id);
};