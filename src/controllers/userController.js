import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';

// GET /api/users/:id (admin or owner)
export const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (req.user.role !== 'admin' && req.user.id !== id)
      return res.status(403).json({ error: 'Forbidden' });

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// POST /api/users (admin only)
export const createUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) return res.status(409).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'user' }
    });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id (admin or owner)
export const updateUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (req.user.role !== 'admin' && req.user.id !== id)
      return res.status(403).json({ error: 'Forbidden' });

    const data = { ...req.body };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    else delete data.password;

    if (data.role && req.user.role !== 'admin') delete data.role;

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id (admin or owner)
export const deleteUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (req.user.role !== 'admin' && req.user.id !== id)
      return res.status(403).json({ error: 'Forbidden' });

    await prisma.user.delete({ where: { id }});
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
