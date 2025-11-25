import prisma from '../src/prismaClient.js';
import bcrypt from 'bcrypt';

// Helper to check if user is admin (case-insensitive)
const isAdmin = (user) => user.role?.toLowerCase() === 'admin';

// GET /users/me
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// GET /users (Admin only)
export const getUsers = async (req, res, next) => {
  if (!isAdmin(req.user)) return res.status(403).json({ error: 'Forbidden' });
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET /users/:id (Admin or owner)
export const getUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  if (!isAdmin(req.user) && req.user.id !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// POST /users (Admin only)
export const createUser = async (req, res, next) => {
  if (!isAdmin(req.user)) return res.status(403).json({ error: 'Forbidden' });

  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'user' }
    });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
};

// PUT /users/:id (Admin or owner)
export const updateUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  if (!isAdmin(req.user) && req.user.id !== id) return res.status(403).json({ error: 'Forbidden' });

  const { name, password, role } = req.body;
  const data = {};
  if (name) data.name = name;
  if (password) data.password = await bcrypt.hash(password, 10);
  if (role && isAdmin(req.user)) data.role = role; // Only admin can change role

  try {
    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    next(err);
  }
};

// DELETE /users/:id (Admin or owner)
export const deleteUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  if (!isAdmin(req.user) && req.user.id !== id) return res.status(403).json({ error: 'Forbidden' });

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    next(err);
  }
};
