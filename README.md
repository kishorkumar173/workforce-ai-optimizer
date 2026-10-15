# TeamPulse Intelligence (WorkForceAI)

> **AI-Powered Workforce Planning, Intelligent Team Formation, and Workload Optimization Platform**

TeamPulse Intelligence is an enterprise SaaS workforce planning platform built for hackathons under the Web & App Development track. It moves beyond static HR databases to provide **Explainable Team Formation**, **Capacity-Aware Workload Allocation**, and **Interactive What-If Staffing Simulation**.

---

## 🌟 Key Features

1. **Enterprise Dashboard**:
   - Pixel-perfect implementation matching the modern SaaS design reference.
   - 4 Real-time KPI summary stat cards with trend sparklines: Total Employees (152), Active Projects (24), Resource Utilization (87%), Project Success Rate (98%).
   - Multi-line area progress charts for sprint tracking and interactive donut charts for departmental workforce breakdown.
   - Active projects table with progress bars, team avatar stacks, deadlines, and status indicators.
   - Integrated AI Assistant companion widget with contextual prompt actions.
2. **Explainable AI Matching Engine**:
   - Deterministic 5-factor scoring model:
     - Competency/Skill Match (40%)
     - Relevant Experience (20%)
     - Temporal Availability (20%)
     - Workload Suitability (10%)
     - Domain Affinity (10%)
   - Delivers transparent rationale, matched skill proficiencies, and missing critical skill warnings.
3. **Multi-Objective Team Composition Optimization**:
   - Combinatorial optimization to ensure critical project requirements are covered by qualified specialists.
   - Generates trade-off summaries, workload safety metrics, and collective seniority scores.
4. **Interactive What-If Simulation Sandbox**:
   - The central differentiator: allows managers to model proposed team adjustments in an isolated sandbox.
   - Live sliders for employee allocation percentages (10% - 100%), personnel additions, and removals.
   - Side-by-side comparison between baseline and simulated configurations with net delta scores and burnout warnings.
   - 1-Click atomic approval transaction that validates feasibility and commits active assignments to the database.
5. **Workload & Capacity Engine**:
   - Granular temporal tracking preventing burnout (>100% capacity).
   - Departmental utilization heatmaps and headroom metrics.
6. **Competency Gap Analysis & Curated Upskilling**:
   - Automatically detects project skill deficits and pairs them with curated courses (DeepLearning.AI, Linux Foundation, Frontend Masters).
7. **Audit Trails & Decision Transparency**:
   - Immutable audit logs recording all team recommendations, approvals, and allocation adjustments.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v7, Recharts, Lucide React, TanStack Query, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, Zod request validation, Helmet, CORS, Morgan structured logging.
- **Database & Auth**: Supabase PostgreSQL with 16 normalized tables, foreign keys, indexes, and Row Level Security (RLS) policies + seamless zero-dependency in-memory/seed demo mode.
- **Testing**: Vitest, Supertest, React Testing Library.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Backend dependencies
npm install --prefix backend

# Frontend dependencies
npm install --prefix frontend
```

### 2. Run in Development Mode
```bash
# Terminal 1: Run Backend API Server (Port 5000)
npm --prefix backend run dev

# Terminal 2: Run Frontend Development Server (Port 5173)
npm --prefix frontend run dev
```

Visit **`http://localhost:5173`** to access the application.

### 3. Run Automated Tests
```bash
# Run backend tests (14 tests: matching engine, optimizer, workload, API endpoints)
npm --prefix backend test

# Run frontend tests
npm --prefix frontend test
```

### 4. Build for Production
```bash
# Compile backend TypeScript
npm --prefix backend run build

# Compile frontend Vite bundle
npm --prefix frontend run build
```

---

## 📂 Project Structure

```
E:\HACKATHON\
├── backend/
│   ├── src/
│   │   ├── algorithms/     # Matching, Optimizer, Workload, Simulation, Gap Analyzer
│   │   ├── config/         # Environment variables & Supabase config
│   │   ├── middleware/     # Auth, RBAC, Error Handler, Audit
│   │   ├── repositories/   # Dual-mode Database Store (In-Memory & Supabase)
│   │   ├── routes/         # REST API endpoints (17 groups)
│   │   ├── types/          # Domain TypeScript models
│   │   ├── validators/     # Zod request body schemas
│   │   ├── app.ts          # Express application configuration
│   │   └── server.ts       # Server entry point
│   ├── tests/              # Vitest & Supertest automated test suites
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Layout, Dashboard, Projects, Employees, AI Assistant
│   │   ├── context/        # AuthContext with dynamic role switcher (Employer/Admin/Employee)
│   │   ├── pages/          # Dashboard, Projects, Workforce, Simulation, Recommendations, etc.
│   │   ├── services/       # Centralized REST API client
│   │   ├── styles/         # Tailwind CSS directives & custom scrollbars
│   │   ├── types/          # Shared frontend interfaces
│   │   ├── App.tsx         # React Router configuration
│   │   └── main.tsx        # React entrypoint
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── supabase/
│   ├── migrations/         # 20260215000001_create_schema.sql (16 tables + RLS)
│   └── seed.sql            # Seed dataset with 152 employees, active projects & skills
├── docs/                   # ARCHITECTURE, DATABASE_SCHEMA, API_DOCUMENTATION, SETUP, DEPLOYMENT, TESTING
├── package.json            # Monorepo root scripts
└── README.md
```

---

## 🛡️ License

MIT License. Built for the Hackathon Web & App Development Track.
