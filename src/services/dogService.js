import * as dogRepository from '../repositories/dogRepository.js';

/**
 * Get all dogs
 */
export const getAllDogs = async () => {
  return await dogRepository.getAllDogs();
};

/**
 * Get dog by ID
 */
export const getDogById = async (id) => {
  const dog = await dogRepository.getDogById(id);
  if (!dog) {
    throw new Error('Dog not found');
  }
  return dog;
};

/**
 * Create a new dog
 */
export const createDog = async (dogData, userId) => {
  // Validate required fields
  if (!dogData.name || !dogData.breed) {
    throw new Error('Name and breed are required');
  }

  // Use authenticated user's ID as ownerId
  const dog = await dogRepository.createDog({
    name: dogData.name,
    breed: dogData.breed,
    ownerId: userId,
  });

  return dog;
};

/**
 * Update a dog
 */
export const updateDog = async (id, dogData, userId) => {
  // Check if dog exists
  const existingDog = await dogRepository.getDogById(id);
  if (!existingDog) {
    throw new Error('Dog not found');
  }

  // Check ownership (only owner can update)
  if (existingDog.ownerId !== userId) {
    throw new Error('Unauthorized: You can only update your own dogs');
  }

  return await dogRepository.updateDog(id, dogData);
};

/**
 * Delete a dog
 */
export const deleteDog = async (id, userId) => {
  // Check if dog exists
  const existingDog = await dogRepository.getDogById(id);
  if (!existingDog) {
    throw new Error('Dog not found');
  }

  // Check ownership (only owner can delete)
  if (existingDog.ownerId !== userId) {
    throw new Error('Unauthorized: You can only delete your own dogs');
  }

  return await dogRepository.deleteDog(id);
};

