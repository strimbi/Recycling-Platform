# Recycling Platform Frontend (React + Vite)

This frontend is wired to the Spring Boot backend you attached.

## Setup

1) Install deps (will update `package-lock.json` because we added React Router):

```bash
npm install
```

2) Configure API URL (optional)

Create `.env` (or copy `.env.example`):

```bash
VITE_API_URL=http://localhost:8080
```

3) Run:

```bash
npm run dev
```

Backend CORS in your module allows `http://localhost:5173` by default, so Vite's default port works out of the box.

## Pages

- `/` Map (public): shows recycling locations + waste-type filter
- `/leaderboard` (public)
- `/login`, `/register`
- `/reports` (auth): submit a report (full/damaged/wrong info/new location)
- `/my-reports` (auth): track your reports and admin feedback
- `/admin/reports` (ADMIN): approve/reject reports (+ optional points override)
- `/admin/locations` (ADMIN): create/update/delete locations

## Notes

- Auth token is stored in `localStorage` under `rp_token`.
- Axios automatically attaches `Authorization: Bearer <token>` when logged in.
- If you run backend with profile `dev`, you can call `POST /api/dev/make-me-admin` (authenticated) to become ADMIN and test the admin pages quickly.
