import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all dogs
 */
export const getAllDogs = async () => {
  return await prisma.dog.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

/**
 * Get dog by ID
 */
export const getDogById = async (id) => {
  return await prisma.dog.findUnique({
    where: { id: parseInt(id) },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

/**
 * Create a new dog
 */
export const createDog = async (dogData) => {
  return await prisma.dog.create({
    data: {
      name: dogData.name,
      breed: dogData.breed,
      ownerId: dogData.ownerId,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

/**
 * Update a dog
 */
export const updateDog = async (id, dogData) => {
  return await prisma.dog.update({
    where: { id: parseInt(id) },
    data: {
      ...(dogData.name && { name: dogData.name }),
      ...(dogData.breed && { breed: dogData.breed }),
      ...(dogData.ownerId && { ownerId: dogData.ownerId }),
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

/**
 * Delete a dog
 */
export const deleteDog = async (id) => {
  return await prisma.dog.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Check if dog exists
 */
export const dogExists = async (id) => {
  const dog = await prisma.dog.findUnique({
    where: { id: parseInt(id) },
  });
  return !!dog;
};

