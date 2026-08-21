# SPAM - Student Portfolio & Achievement Management

A centralized digital platform for higher education institutions to manage student achievements and portfolios.

## Migration Completed ✅

This project has been migrated from Next.js (app folder) to Vite + React with React Router.

## Features

- **Student Dashboard**: Track achievements, submit activities, view portfolio
- **Admin Dashboard**: Review submissions, approve/reject activities, analytics
- **Authentication**: Login/Register for students, teachers, and admins
- **Portfolio Management**: Generate and download student portfolios
- **Real-time Updates**: Toast notifications and live status updates

## Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Tailwind
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner (Toast)

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables** (Optional)
   Create a `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## Routes

- `/` - Home page
- `/login` - Login/Register page
- `/student/dashboard` - Student dashboard
- `/student/upload` - Upload activity
- `/student/portfolio` - View portfolio
- `/admin/dashboard` - Admin dashboard

## Key Changes from Next.js

1. **Routing**: Next.js file-based routing → React Router
2. **Navigation**: `next/navigation` → `react-router-dom`
3. **Link**: `next/link` → `react-router-dom Link`
4. **Removed**: Server components, Next.js Image, API routes (using backend)

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - Run ESLint
