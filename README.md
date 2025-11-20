# User Management API

A NestJS-based REST API for user management with caching and rate limiting.

## Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

## Start Application

```bash
# Development mode
npm run start:dev
# or
pnpm start:dev

The server will start on `http://localhost:3000`

## API Endpoints

### Get User
```bash
curl -X GET http://localhost:3000/users/1
```

### Create User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "New User", "email": "newuser@example.com"}'
```

### Get Cache Status
```bash
curl -X GET http://localhost:3000/cache-status
```

### Clear Cache
```bash
curl -X DELETE http://localhost:3000/cache
```

## Rate Limiting
- 10 requests per minute
- 5 requests per 10 seconds (burst)

## Features
- User CRUD operations
- In-memory caching
- Rate limiting
- Mock data storage