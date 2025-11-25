import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dogRoutes from './routes/dogRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { swaggerUi, swaggerSpec } from './src/swagger/swagger.js';

import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/dogs', dogRoutes);
app.use('/bookings', bookingRoutes);

// 404 Handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
}); 

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));