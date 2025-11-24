import * as dogService from '../services/dogService.js';

/**
 * GET /dogs - Get all dogs
 */
export const getAllDogs = async (req, res, next) => {
  try {
    const dogs = await dogService.getAllDogs();
    res.json(dogs);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /dogs/:id - Get dog by ID
 */
export const getDogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dog = await dogService.getDogById(id);
    res.json(dog);
  } catch (error) {
    if (error.message === 'Dog not found') {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * POST /dogs - Create new dog
 */
export const createDog = async (req, res, next) => {
  try {
    // userId should be set by auth middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const dog = await dogService.createDog(req.body, userId);
    res.status(201).json(dog);
  } catch (error) {
    if (error.message === 'Name and breed are required') {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * PUT /dogs/:id - Update dog
 */
export const updateDog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const dog = await dogService.updateDog(id, req.body, userId);
    res.json(dog);
  } catch (error) {
    if (error.message === 'Dog not found') {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('Unauthorized')) {
      res.status(403).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * DELETE /dogs/:id - Delete dog
 */
export const deleteDog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dogService.deleteDog(id, userId);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Dog not found') {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('Unauthorized')) {
      res.status(403).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

