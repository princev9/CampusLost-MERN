# CampusLost — MERN Lost & Found Portal

A full-stack student lost-and-found application built with React, Bootstrap 5, Express, MongoDB Atlas, JWT and bcrypt.

## Requirements
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)
- npm

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
```
Edit `backend/.env` and set:
- `MONGO_URI` to your MongoDB Atlas connection string
- `JWT_SECRET` to a long random secret
- `CLIENT_URL=http://localhost:5173`
- `ADMIN_EMAIL` to the email that should receive admin access

Then:
```bash
npm install
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Frontend
Open a second terminal. Optionally copy `frontend/.env.example` to `frontend/.env` if your API is not running at the default URL.
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

Register using the email configured as `ADMIN_EMAIL` to receive the admin role. Other registrations receive the student role.

## Main functionality
- Student registration and login (bcrypt password hashing + JWT)
- Protected routes and current-user endpoint
- Create, view, edit and delete lost/found listings
- Search by title, description, category and location
- Filter by Lost / Found and category
- Contact listing owner using their public contact email
- Student dashboard and profile update
- Admin listing moderation and user listing endpoint

## API
Base URL: `/api`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (JWT required)

### Items
- `GET /api/items?q=&type=&category=`
- `GET /api/items/mine` (JWT required; all of your listings)
- `GET /api/items/:id`
- `POST /api/items` (JWT required)
- `PUT /api/items/:id` (owner or admin)
- `DELETE /api/items/:id` (owner or admin)

### Profile
- `GET /api/users/profile` (JWT required)
- `PUT /api/users/profile` (JWT required)

### Admin
- `GET /api/admin/users` (admin)
- `GET /api/admin/items` (admin)
- `PATCH /api/admin/items/:id/status` (admin; body `{ "status": "active" | "resolved" | "hidden" }`)
- `DELETE /api/admin/users/:id` (admin)

## Notes
- Item image URL is optional. This starter stores a URL, not uploaded image files.
- Contact is provided through an email link; no private messaging service is included.
- Never commit `.env`. Use a unique production JWT secret and HTTPS in deployment.
