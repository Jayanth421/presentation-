# PPT Presentation Management Web Application

Full-stack PPT management system for a college with Google OAuth domain restriction, role-based access, and secure PPT distribution.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Auth: Google OAuth 2.0 (restricted to `@cmrcet.ac.in`)
- Storage: Local `server/uploads/`

## Project Structure
```
frontend (root)
  src/
    components/
    pages/
    services/
    App.jsx
    main.jsx
    index.css
backend
  server/
    routes/
    controllers/
    models/
    middleware/
    uploads/
    server.js
```

## Setup

### 1) Backend
```
cd server
npm install
```
Create `server/.env` from `server/.env.example` and update values.

Run:
```
npm run dev
```

### 2) Frontend
```
npm install
```
Create `.env` from `.env.example` and update values.

Run:
```
npm run dev
```

## Google OAuth Setup
- Create OAuth client in Google Cloud Console.
- Add authorized origin: `http://localhost:5173`.
- Add authorized redirect URI if needed by your setup.
- Set `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` to the same value.

## Roles & Permissions
- Admin: manage users, subjects, classes, assignments, PPTs.
- Faculty: upload PPTs only for assigned subjects, view students and PPTs.
- Student: view assigned subjects and download PPTs.

## Notes
- Only emails ending with `@cmrcet.ac.in` are allowed.
- Personal domains (gmail, yahoo, outlook, etc.) are rejected.
- PPT/PPTX only.

## Scripts
- Frontend: `npm run dev`, `npm run build`
- Backend: `npm run dev`, `npm run start`
