# Technical Documentation & Architecture Specification

## 1. System Overview & Architecture

The Ziptrrip Todo Application is engineered following modern software engineering principles, adhering strictly to **Layered Architecture (Controller-Service-Repository pattern)** on the backend and **Multi-Page Application (MPA)** architecture on the frontend.

```
+-------------------------------------------------------------+
|                      React Frontend (MPA)                    |
|  - Page 1: /todos (Dashboard with search, filter, stats)    |
|  - Page 2: /todo?id=<todo_id> (Single Item Detail Page)    |
+------------------------------+------------------------------+
                               | Axios REST APIs
                               v
+-------------------------------------------------------------+
|                      Express REST Backend                   |
|  - Middleware: Zod Validation, CORS, Global Error Handler    |
|  - Controllers: Request/Response HTTP Mapping               |
|  - Services: Business Rules & Validation Logic               |
|  - Repositories: SQLite Query Abstraction                   |
+------------------------------+------------------------------+
                               | SQL / Foreign Keys
                               v
+-------------------------------------------------------------+
|                     SQLite Database (todos.db)              |
|  - Tables: 'todos' & 'subtasks' (Cascading Foreign Key)     |
|  - Indexes: status, priority, category, todoId               |
+-------------------------------------------------------------+
```

---

## 2. Backend Design Specification

### 2.1 Layered Architecture Rationale
- **Controller Layer (`/src/controllers`)**: Manages HTTP status codes, extracts request query parameters and body payloads, and delegates work to services.
- **Service Layer (`/src/services`)**: Enforces domain business rules (e.g. trimming titles, ensuring non-empty fields, calculating status summaries, handling non-existent item errors).
- **Repository Layer (`/src/repositories`)**: Encapsulates all SQL statements (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) and manages relational mappings between `todos` and `subtasks`.
- **Validation Middleware (`/src/middlewares/validateRequest.ts`)**: Uses **Zod** to validate incoming JSON bodies prior to reaching controllers, ensuring type safety and preventing malformed inputs.

### 2.2 Database Schema

#### `todos` Table
```sql
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL DEFAULT 'General',
  dueDate TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]'
);
```

#### `subtasks` Table
```sql
CREATE TABLE IF NOT EXISTS subtasks (
  id TEXT PRIMARY KEY,
  todoId TEXT NOT NULL,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE
);
```

---

## 3. Frontend Multi-Page Application (MPA) Rationale

The requirement specified:
> "Implement a basic react application. Application has to be Multiple page application (MPA) instead of SPA. Make one page for todos list... Make a second page for a single todo item. This page should receive a query parameter of todo id and display the todo."

### Implementation details:
1. **Multi-Page Routes**: Built using Next.js Pages Router, serving distinct HTML document page routes (`/todos` and `/todo`).
2. **Query Parameter Support**: On `/todo?id=xyz`, `router.query.id` reads the `id` from the URL, fetches single item details from `GET /api/todos/:id`, and renders the detailed view with subtasks.

---

## 4. Unit Testing Strategy

Unit tests are written using **Vitest**.
The service unit test suite (`tests/todo.service.test.ts`) tests:
1. Retrieval of todo lists with filtering and pagination parameters.
2. 404 error throwing on invalid ID lookups.
3. String whitespace trimming and mandatory title checks during todo creation.
4. Validation rules on updating title strings.
5. Successful todo deletion.
6. Subtask creation and relational association.

To execute tests:
```bash
cd backend
npm test
```
