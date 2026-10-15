# REST API Documentation

Base URL: `/api`  
Default Port: `5000`

## Headers
- `Content-Type: application/json`
- `Authorization: Bearer <supabase-jwt>` (Optional when using demo role headers)
- `x-user-role: ADMIN | EMPLOYER | EMPLOYEE`
- `x-user-id: <user-uuid>`
- `x-user-name: <user-name>`

---

## 1. System & Authentication
- `GET /api/health`: Health status, server uptime, and database connection mode.
- `GET /api/me`: Returns the authenticated user session and role.
- `GET /api/me/profile`: Returns detailed profile information.
- `PATCH /api/me/profile`: Update display name or avatar URL.

## 2. Workforce Directory
- `GET /api/employees`: Query active employees with filters (`department`, `status`, `search`, `skill`).
- `GET /api/employees/:id`: Retrieve single employee, verified skills, and active project assignments.
- `POST /api/employees`: Create new employee (requires `ADMIN` or `EMPLOYER` role).
- `PATCH /api/employees/:id`: Update employee records.
- `DELETE /api/employees/:id`: Soft delete employee to preserve historical assignments.

## 3. Skills & Competencies
- `GET /api/skills`: Returns standardized competency catalog.
- `POST /api/skills`: Create a new competency.
- `GET /api/employees/:id/skills`: Returns verified and self-reported skills for an employee.

## 4. Projects & Requirements
- `GET /api/projects`: List active projects with filters (`status`, `department`, `priority`).
- `GET /api/projects/:id`: Get project details and live skill gap analysis report.
- `POST /api/projects`: Create a new project initiative.
- `PATCH /api/projects/:id`: Modify project details or deadline.
- `DELETE /api/projects/:id`: Remove project.
- `GET /api/projects/:id/requirements`: List competency requirements.
- `PUT /api/projects/:id/requirements`: Replace and save competency requirements.

## 5. Team Formation & Recommendations
- `POST /api/projects/:id/recommendations`: Trigger the AI matching and combinatorial optimization engine.
- `GET /api/projects/:id/recommendations`: Retrieve past recommendations for a project.
- `GET /api/recommendations/:id`: Retrieve a specific recommendation by ID.
- `GET /api/projects/:id/candidates`: Return ranked individual candidate suitability evaluations.

## 6. What-If Simulation Sandbox
- `POST /api/projects/:id/simulations`:
  - Request body:
    ```json
    {
      "proposedMembers": [
        { "employeeId": "emp-1", "role": "Lead Architect", "allocationPercentage": 60 }
      ]
    }
    ```
  - Returns side-by-side comparison (Baseline vs Simulated), delta metrics, and approval feasibility.

## 7. Atomic Team Approval
- `POST /api/recommendations/:id/approve`:
  - Validates constraints, marks recommendation as `ACCEPTED`, commits active assignments, archives conflicting allocations, and logs audit record.

## 8. Workload & Capacity
- `GET /api/workload/overview`: Returns organization-wide capacity hours, average utilization %, department heatmaps, and overloaded staff alerts.

## 9. Upskilling & Development Goals
- `GET /api/training-resources`: Curated training catalog.
- `GET /api/development-goals`: Returns employee career progression goals.
- `POST /api/development-goals`: Create new development goal.

## 10. Audit & Decision Logs
- `GET /api/audit-logs`: Returns immutable history of managerial decisions.

## 11. Conversational AI Assistant
- `POST /api/ai/assistant/chat`:
  - Request body: `{ "prompt": "Suggest optimal team for new project" }`
  - Returns grounded contextual workforce guidance with follow-up action pills.
