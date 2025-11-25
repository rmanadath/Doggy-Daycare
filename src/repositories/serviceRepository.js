import prisma from "../prismaClient.js";

/**
 * Get all services
 */
export const getAllServices = async () => {
  return await prisma.service.findMany();
};

/**
 * Get service by ID
 */
export const getServiceById = async (id) => {
  return await prisma.service.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Create new service
 */
export const createService = async (serviceData) => {
  return await prisma.service.create({
    data: {
      name: serviceData.name,
      description: serviceData.description,
      price: serviceData.price,
      active: serviceData.active ?? true,
    },
  });
};

/**
 * Update service
 */
export const updateService = async (id, serviceData) => {
  return await prisma.service.update({
    where: { id: parseInt(id) },
    data: {
      ...(serviceData.name && { name: serviceData.name }),
      ...(serviceData.description && { description: serviceData.description }),
      ...(serviceData.price !== undefined && { price: serviceData.price }),
      ...(serviceData.active !== undefined && { active: serviceData.active }),
    },
  });
};

/**
 * Delete service
 */
export const deleteService = async (id) => {
  return await prisma.service.delete({
    where: { id: parseInt(id) },
  });
};
