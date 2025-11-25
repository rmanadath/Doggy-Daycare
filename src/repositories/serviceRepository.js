import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all services
 */
export const getAllServices = async () => {
  return await prisma.productService.findMany();
};

/**
 * Get service by ID
 */
export const getServiceById = async (id) => {
  return await prisma.productService.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Create new service
 */
export const createService = async (serviceData) => {
  return await prisma.productService.create({
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
  return await prisma.productService.update({
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
  return await prisma.productService.delete({
    where: { id: parseInt(id) },
  });
};
