# Cloud Deployment Guide

This guide describes how to deploy TeamPulse Intelligence to production hosting platforms.

---

## 1. Database Deployment (Supabase)
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Under **SQL Editor**, create a new query and paste the contents of:
   `supabase/migrations/20260215000001_create_schema.sql`
3. Run the query to initialize all 16 tables, constraints, indexes, and Row Level Security policies.
4. Execute `supabase/seed.sql` to populate initial competencies, enterprise initiatives, and baseline assignments.
5. In **Project Settings -> API**, copy:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key

---

## 2. Backend Deployment (Render / Railway / Fly.io / AWS ECS)

1. Connect your repository to your Node.js hosting provider.
2. Set Root Directory to `backend`.
3. Set Build Command:
   ```bash
   npm install && npm run build
   ```
4. Set Start Command:
   ```bash
   npm start
   ```
5. Configure Environment Variables:
   ```env
   NODE_ENV=production
   PORT=5000
   FRONTEND_ORIGIN=https://your-frontend-domain.vercel.app
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
6. Verify deployment by sending a GET request to:
   `https://your-backend-domain.com/api/health`

---

## 3. Frontend Deployment (Vercel / Netlify / Cloudflare Pages)

1. Connect your repository to Vercel or Netlify.
2. Set Root Directory to `frontend`.
3. Set Build Command:
   ```bash
   npm run build
   ```
4. Set Output Directory:
   `dist`
5. Configure Environment Variables:
   ```env
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
6. Deploy and access your live enterprise workforce intelligence platform!
