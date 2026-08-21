# SPAM — Student Portfolio & Achievement Management System

SPAM is a web application for tracking and managing student achievements,
portfolios, and academic records in an educational institution. It provides two
role-based experiences — **Admin** and **Student** — for registering students,
verifying achievement submissions, managing notices, and building digital
student portfolios.

The frontend ships in **demo mode by default**: every API call is served from an
in-browser mock seeded with realistic dummy data, so the app runs and deploys
with **no backend and no database**. A single environment variable switches it
back to the real Express + MongoDB API.

---

## Features

**Admin**
- Register and manage student accounts
- Review and verify student achievement submissions
- Post and manage notices for students
- View student records and activity logs
- Manage admin profile

**Student**
- Set up and maintain a personal profile
- Build a digital portfolio (skills, internships, projects, certificates, academic results)
- Upload achievement files/documents for verification
- View notices posted by admins
- Track submission status and activity logs

**Platform**
- Role-based access control (admin/student)
- Portfolio export to PDF
- Audit logging of key actions
- Demo mode with seeded dummy data, requiring no database
- Real backend mode: JWT auth, Argon2 password hashing, Zod validation, Multer uploads

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS, Framer Motion |
| Demo data | In-browser mock API backed by `localStorage` |
| Backend *(optional)* | Node.js, Express 5 |
| Database *(optional)* | MongoDB (Mongoose) |
| Auth *(backend mode)* | JWT, Argon2 |
| Validation | Zod |
| File Uploads | Multer |

---

## Project structure

```
SPAM/
├── Frontend/              React + Vite SPA  (this is what deploys)
│   ├── public/demo/       Dummy avatars and sample proof documents
│   └── src/
│       ├── components/    Shared UI primitives + Navigation
│       ├── pages/         Route components (student/, admin/, Home, Login)
│       │   └── lib/       backend-api.js — the single API surface for all pages
│       └── mock/          Demo-mode backend: seed data, store, mock API
├── SPAM_Backend/          Express + MongoDB API (optional; not deployed to Vercel)
│   ├── controller/        admin/, student/ route handlers
│   ├── routes/            admin/, student/ route definitions
│   ├── model/             Mongoose schemas
│   ├── middleware/        auth, upload middleware
│   ├── validator/         Zod validation schemas
│   └── utils/
├── docs/                  Synopsis, presentation and reference documentation
├── vercel.json            Vercel build configuration
└── package.json           Root convenience scripts
```

---

## Getting started

### 1. Clone

```bash
git clone https://github.com/kanishksharma12377/SPAM.git
cd SPAM
```

### 2. Install and run

```bash
npm --prefix Frontend install
npm start                  # http://localhost:5173
```

That is all. Demo mode needs no database and no API server.

### Demo accounts

| Role    | Username  | Password     |
| ------- | --------- | ------------ |
| Admin   | `admin`   | `admin123`   |
| Student | `scs0001` | `student123` |

Both are click-to-fill on the login screen. Every seeded student uses the
password `student123`; sign in as `scs0006` or `sce0007` to see the first-time
**profile setup** flow, and as `scs0001` for a fully populated portfolio.

### What the demo data contains

- 8 registered students across all four years and branches (6 with completed
  portfolios, 2 pending setup)
- 8 verification requests spanning every category and all three states
  (pending / accepted / rejected)
- 7 notices covering each targeting mode: everyone, a specific cohort
  (year + branch + skill), and named individuals
- 15 activity log entries

Edits you make — approving a submission, registering a student, publishing a
notice — persist in that browser's `localStorage`. **Reset data** on the login
screen restores the original seed.

---

## Deploy to Vercel

The repository root contains a `vercel.json`, so no dashboard configuration is
needed:

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo.
3. Leave every build setting at its default and click **Deploy**.

`vercel.json` installs and builds only `Frontend/`, publishes `Frontend/dist`,
and rewrites all routes to `index.html` so client-side routes such as
`/student/portfolio` survive a page refresh. No environment variables are
required for a demo deploy.

> To configure Vercel manually instead, set **Root Directory** to `Frontend`,
> framework preset **Vite**, and add a rewrite from `/(.*)` to `/index.html`.

---

## Running against the real backend

Demo mode is a single flag. To point the frontend at the Express API in
`SPAM_Backend/`:

```env
# Frontend/.env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:3000
```

Then configure and start the server:

```bash
cp SPAM_Backend/.env.example SPAM_Backend/.env   # fill in MONGODB_URI and JWT_SECRET
npm run install:all
npm run start:all                                # API + frontend together
```

`Frontend/src/pages/lib/backend-api.js` exposes the same `authAPI`,
`studentAPI` and `adminAPI` objects in both modes, so no page component changes
when you flip the flag.

The Express backend is **not** deployable to Vercel as-is: it stores uploaded
files on local disk and needs a persistent MongoDB connection. Host it on a
service with a real filesystem and point `VITE_API_BASE_URL` at it.

### API overview (backend mode)

The backend exposes REST endpoints under `/api`:

- `POST /api/login` — authenticate a user
- `POST /api/logout` — log out (requires auth)
- `/api/admin/*` — admin-only routes (student registration, records, notices, uploads, logs, profile)
- `/api/*` — student routes (profile, portfolio uploads, records, notices, logs)

Authentication is cookie-based using JWTs, with middleware protecting
role-restricted routes.

---

## Scripts (root)

| Script | Description |
|---|---|
| `npm start` / `npm run dev` | Run the frontend in demo mode (no database needed) |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the frontend |
| `npm run install:all` | Install dependencies in root, frontend and backend |
| `npm run start:backend` | Run only the Express backend (with `--watch`) |
| `npm run start:all` | Run backend and frontend concurrently |

---

## Security note

Never commit `SPAM_Backend/.env`. Both `.env` files are gitignored; use
`SPAM_Backend/.env.example` and `Frontend/.env.example` as templates and keep
real connection strings and secrets out of version control.

## License

No license has been specified for this project.
