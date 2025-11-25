# Doggy Daycare API - Overview

## Base URL
- Local: `http://localhost:3000`
- Production: `https://doggy-daycare.onrender.com/`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Get a token by calling `POST /auth/login`

## Resources

### 1. Authentication (`/auth`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token

### 2. Users (`/users`)
- `GET /users` - List all users (admin only)
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### 3. Dogs (`/dogs`)
- `GET /dogs` - List dogs
- `GET /dogs/:id` - Get dog details
- `POST /dogs` - Create new dog
- `PUT /dogs/:id` - Update dog
- `DELETE /dogs/:id` - Delete dog

### 4. Services (`/services`)
- `GET /services` - List all services
- `GET /services/:id` - Get service details
- `POST /services` - Create new service
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service

### 5. Bookings (`/bookings`)
- `GET /bookings` - List bookings
- `GET /bookings/:id` - Get booking details
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking
- `PATCH /bookings/:id/status` - Update booking status
- `DELETE /bookings/:id` - Delete booking

## Authorization Roles

### Admin
- Full access to all resources
- Can view/modify all bookings
- Can manage all dogs and services

### User (Regular)
- Can only view/modify own dogs
- Can only view/modify bookings for own dogs
- Can view all services
- Cannot access other users' data

## Response Codes
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `409` - Conflict (e.g., time slot already booked)
- `500` - Internal Server Error

## Rate Limiting
Currently no rate limiting implemented.

## Pagination
Currently not implemented. All GET requests return full lists.

## Error Response Format
```json
{
  "error": "Error message here"
}
```

## Success Response Format
Varies by endpoint, typically returns the resource object.