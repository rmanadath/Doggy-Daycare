// src/services/userService.js
import * as userRepo from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';

export const registerUser = async ({ name, email, password, role }) => {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(password, 10);
  const user = await userRepo.createUser({ name, email, password: hashed, role: role || 'user' });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

export const getUser = async (id) => {
  const user = await userRepo.findUserById(id);
  if (!user) throw new Error('User not found');
  return user;
};

export const getAllUsers = async () => {
  return await userRepo.getAllUsers();
};

export const updateUser = async (id, data) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  return await userRepo.updateUser(id, data);
};

export const deleteUser = async (id) => {
  return await userRepo.deleteUser(id);
};
