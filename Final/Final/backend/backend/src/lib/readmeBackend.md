# Sai-Ram Project Backend

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)

A robust backend API for the Sai-Ram Project, built with Next.js App Router, MySQL, and NextAuth for authentication.

**Live Backend:** [https://sai-ram-project.vercel.app/](https://sai-ram-project.vercel.app/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Deployment](#deployment)

## Features

- User registration and login with JWT-based authentication
- User management and profile retrieval
- Subject and tutoring category management
- Tutoring request creation and acceptance workflow
- Booking system with foreign key validation
- Planner event management
- Reviews and ratings system
- Blog post management
- Protected routes with middleware
- Clean and modular API architecture

##  Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Authentication:** NextAuth (Credentials Provider, JWT sessions)
- **Database:** MySQL2
- **Language:** TypeScript
- **Hosting:** Vercel

## Project Structure

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   ├── users/
│   │   ├── route.ts
│   │   └── me/
│   │       └── route.ts
│   ├── subjects/
│   │   └── route.ts
│   ├── requests/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── bookings/
│   │   └── route.ts
│   ├── planner/
│   │   └── route.ts
│   ├── reviews/
│   │   └── route.ts
│   └── blog/
│       └── route.ts
├── lib/
│   ├── db.ts
│   └── auth.ts
├── types/
│   └── next-auth.d.ts
└── middleware.ts
```

## Installation

1. Clone the repository

```bash
git clone https://github.com/sai-ram-mother/sai-ram-project.git
cd sai-ram-project/backend/backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Run the development server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
DATABASE_HOST=your_database_host
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** For production, update `NEXTAUTH_URL` to your deployed URL.

## 📡 API Endpoints

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/users` | Register a new user | No |
| `GET` | `/api/users` | List all users | Yes |
| `GET` | `/api/users/me` | Get current user profile | Yes |

### Subjects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/subjects` | List all subjects | Yes |
| `POST` | `/api/subjects` | Create a new subject | Yes |

### Requests

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/requests` | Create tutoring request | Yes |
| `GET` | `/api/requests` | List all requests | Yes |
| `PUT` | `/api/requests/:id` | Update or accept request | Yes |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/bookings` | Create a booking | Yes |
| `GET` | `/api/bookings` | List all bookings | Yes |

### Planner

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/planner` | Get planner events | Yes |
| `POST` | `/api/planner` | Add new event | Yes |

### Reviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/reviews` | List all reviews | Yes |
| `POST` | `/api/reviews` | Add a review | Yes |

### Blog

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/blog` | List blog posts | No |

## Authentication

This project uses **NextAuth** with a Credentials Provider for authentication.

### Registration

```bash
POST /api/users
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@test.com",
  "password": "Password123",
  "userRole": "student"
}
```

### Login

Authentication is handled automatically by NextAuth at `/api/auth/[...nextauth]`. Sessions are managed using JWT tokens.

### Protected Routes

Routes are protected using Next.js middleware. Authenticated requests must include valid session tokens.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Configure environment variables in the Vercel dashboard
4. Deploy

> **Important:** MySQL must be hosted externally (e.g., PlanetScale, Railway, AWS RDS)

### Environment Variables on Vercel

Make sure to add all environment variables from `.env.local` to your Vercel project settings.

### Hosted at : https://sai-ram-project.vercel.app/