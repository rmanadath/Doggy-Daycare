import prisma from "../src/prismaClient.js";

import bcrypt from 'bcrypt'; 

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.bookingService.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.dog.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@daycare.com',
      password: adminPassword,
      role: 'Admin',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
    },
  });

  console.log('Created users:', { admin: admin.id, user: user.id });

  // Create dogs for the regular user
  const dog1 = await prisma.dog.create({
    data: {
      name: 'Buddy',
      breed: 'Beagle',
      ownerId: user.id,
    },
  });

  const dog2 = await prisma.dog.create({
    data: {
      name: 'Max',
      breed: 'Golden Retriever',
      ownerId: user.id,
    },
  });

  const dog3 = await prisma.dog.create({
    data: {
      name: 'Luna',
      breed: 'Labrador',
      ownerId: admin.id,
    },
  });

  console.log('Created dogs:', { dog1: dog1.id, dog2: dog2.id, dog3: dog3.id });

  // Create services
  const service1 = await prisma.service.create({
    data: {
      name: 'Full Day',
      description: 'Full day daycare service',
      price: 45.00,
      active: true,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      name: 'Half Day',
      description: 'Half day daycare service (up to 5 hours)',
      price: 30.00,
      active: true,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      name: 'Grooming',
      description: 'Bath & brush',
      price: 40.00,
      active: true,
    },
  });

  const service4 = await prisma.service.create({
    data: {
      name: 'Nail Trim',
      description: 'Nail trimming service',
      price: 12.00,
      active: true,
    },
  });

  const service5 = await prisma.service.create({
    data: {
      name: 'Vet Check',
      description: 'Veterinary checkup',
      price: 45.00,
      active: true,
    },
  });

  console.log('Created services');

  // Create bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const booking1 = await prisma.booking.create({
    data: {
      dogId: dog1.id,
      date: tomorrow,
      checkInTime: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000),
      checkOutTime: new Date(tomorrow.getTime() + 17 * 60 * 60 * 1000 + 30 * 60 * 1000),
      status: 'CONFIRMED',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      dogId: dog2.id,
      date: tomorrow,
      checkInTime: new Date(tomorrow.getTime() + 9 * 60 * 60 * 1000),
      checkOutTime: new Date(tomorrow.getTime() + 15 * 60 * 60 * 1000),
      status: 'PENDING',
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      dogId: dog3.id,
      date: today,
      checkInTime: new Date(today.getTime() + 8 * 60 * 60 * 1000),
      checkOutTime: new Date(today.getTime() + 17 * 60 * 60 * 1000),
      status: 'CONFIRMED',
    },
  });

  console.log('Created bookings');

  // Create booking-service relationships
  await prisma.bookingService.create({
    data: {
      bookingId: booking1.id,
      serviceId: service1.id,
      quantity: 1,
    },
  });

  await prisma.bookingService.create({
    data: {
      bookingId: booking1.id,
      serviceId: service4.id,
      quantity: 1,
    },
  });

  await prisma.bookingService.create({
    data: {
      bookingId: booking2.id,
      serviceId: service2.id,
      quantity: 1,
    },
  });

  await prisma.bookingService.create({
    data: {
      bookingId: booking3.id,
      serviceId: service1.id,
      quantity: 1,
    },
  });

  await prisma.bookingService.create({
    data: {
      bookingId: booking3.id,
      serviceId: service3.id,
      quantity: 1,
    },
  });

  console.log('Created booking-service relationships');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

