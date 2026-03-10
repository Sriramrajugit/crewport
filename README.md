# CrewPort - Crew Management and Inventory System

A REST API system that acts as a mediator between crew members and offshore admins. It manages crew member profiles, vessel assignments, and inventory tracking.

## Features

- **User Authentication**: JWT-based auth with role-based access control (crew/admin)
- **Crew Management**: Full CRUD for crew member profiles with vessel assignments
- **Vessel Management**: Track vessels with type, flag, status, and port information
- **Inventory Tracking**: Manage inventory items per vessel with low-stock alerts
- **Role-Based Access**: Admins can manage all resources; crew members can view/update their own records

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Testing**: Jest + supertest + mongodb-memory-server
- **Validation**: express-validator

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set your JWT_SECRET and MONGO_URI
   ```

3. **Start the server**
   ```bash
   npm start        # production
   npm run dev      # development with nodemon
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Crew Members
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/crew` | All authenticated | List crew members (admin: all, crew: own) |
| GET | `/api/crew/:id` | All authenticated | Get single crew member |
| POST | `/api/crew` | Admin only | Create crew member |
| PUT | `/api/crew/:id` | Admin or own record | Update crew member |
| DELETE | `/api/crew/:id` | Admin only | Delete crew member |

**Query params**: `vessel` (ObjectId), `status` (onboard/ashore/standby)

### Vessels
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/vessels` | All authenticated | List vessels |
| GET | `/api/vessels/:id` | All authenticated | Get single vessel |
| POST | `/api/vessels` | Admin only | Create vessel |
| PUT | `/api/vessels/:id` | Admin only | Update vessel |
| DELETE | `/api/vessels/:id` | Admin only | Delete vessel |

### Inventory
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/inventory` | All authenticated | List inventory items |
| GET | `/api/inventory/:id` | All authenticated | Get single item |
| POST | `/api/inventory` | Admin only | Create inventory item |
| PUT | `/api/inventory/:id` | Admin only | Update inventory item |
| DELETE | `/api/inventory/:id` | Admin only | Delete inventory item |

**Query params**: `vessel` (ObjectId), `category`, `lowStock=true`

## Role-Based Access

- **admin**: Full access to all resources - CRUD on crew, vessels, and inventory
- **crew**: Read-only access to vessels and inventory; can view and update their own crew profile