# Local Setup & Getting Started

## Prerequisites
- Node.js (v18.0.0 or higher, tested on v24.15.0)
- npm (v9.0.0 or higher)
- Git

---

## 1. Installation

From the project root:

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```

---

## 2. Running in Development Mode

You can run both servers concurrently or in separate terminals:

### Terminal 1: Backend API Server
```bash
cd backend
npm run dev
```
Backend will start on: **`http://localhost:5000`**  
Health Check: **`http://localhost:5000/api/health`**

### Terminal 2: Frontend Vite Development Server
```bash
cd frontend
npm run dev
```
Frontend will be available on: **`http://localhost:5173`**

---

## 3. Running Automated Tests

```bash
# Run backend unit and API tests (14 tests)
npm --prefix backend test

# Run frontend UI tests
npm --prefix frontend test
```

---

## 4. Connecting Supabase (Optional)

The application works completely out of the box using its built-in in-memory state engine preloaded with 152 employees, active projects, competencies, and audit records.

To link a cloud Supabase PostgreSQL instance:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor in Supabase and execute the migration script:
   `supabase/migrations/20260215000001_create_schema.sql`
3. Execute the seed script:
   `supabase/seed.sql`
4. Copy your project URL, anon key, and service role key into `backend/.env`:
   ```env
   SUPABASE_URL=https://xyzcompany.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```
5. Restart the backend server.
