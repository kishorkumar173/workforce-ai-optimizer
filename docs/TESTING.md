# Testing Documentation & Verification Suite

## Automated Test Architecture

The platform includes automated unit and integration tests using **Vitest**, **Supertest**, and **React Testing Library**.

### 1. Backend Algorithmic Unit Tests (`backend/tests/algorithms.test.ts`)
- `MatchingEngine`: Verifies 5-factor weighted candidate scoring, missing skill penalties, verified credentials weighting, and capacity warning generation.
- `CompositionOptimizer`: Verifies multi-objective combinatorial selection, critical skill coverage, and trade-off summary calculation.
- `WorkloadCalculator`: Verifies temporal allocation math, department breakdown, and detection of overcapacity personnel (>100% capacity).
- `SkillGapAnalyzer`: Verifies identification of covered, partially covered, and uncovered skills, matching each gap to curated training resources.
- `SimulationEngine`: Verifies non-committed sandbox evaluation, delta score tracking, newly covered skill detection, and approval feasibility checks.

### 2. Backend REST API Supertest Suite (`backend/tests/api.test.ts`)
- `GET /api/health`: Confirms health check returns 200.
- `GET /api/employees`: Confirms directory listing enriched with live utilization.
- `POST /api/employees`: Tests Zod validation rejects missing fields or invalid email formats.
- `GET /api/projects`: Confirms seeded project listing matching the UI reference design.
- `POST /api/projects/:id/recommendations`: Verifies recommendation generation returns explainable output and members.
- `POST /api/recommendations/:id/approve`: Tests atomic approval transaction, verifies assignments are created and recommendation status switches to `ACCEPTED`.
- `GET /api/workload/overview`: Verifies organization-wide workload aggregation.
- `POST /api/ai/assistant/chat`: Verifies conversational AI workforce advisor replies with grounded responses and action pills.

### 3. Frontend Component & Layout Suite (`frontend/src/test/App.test.tsx`)
- Verifies application brand header (`WorkForceAI`), navigation items, and layout shell.
- Verifies KPI Stat Cards render: Total Employees (152), Active Projects (24), Resource Utilization (87%), Project Success Rate (98%).
- Verifies AI Assistant companion card and interactive prompt action pills.

---

## Running Verification Commands

```bash
# Execute backend test suite
npm --prefix backend test

# Execute frontend test suite
npm --prefix frontend test

# Execute backend production build (TypeScript compiler)
npm --prefix backend run build

# Execute frontend production build (TypeScript + Vite)
npm --prefix frontend run build
```
