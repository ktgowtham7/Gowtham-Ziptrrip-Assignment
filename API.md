# Ziptrrip Todo Application REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Health Check
* **Endpoint**: `GET /health`
* **Description**: Verifies if the backend API server is operational.
* **Response (200 OK)**:
```json
{
  "status": "OK",
  "message": "Ziptrrip Todo API Server is running smoothly",
  "timestamp": "2026-07-27T13:40:00.000Z"
}
```

---

## 2. Get Summary Statistics
* **Endpoint**: `GET /todos/stats/summary`
* **Description**: Returns counts of todos grouped by status, priority, category, and overdue state.
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total": 3,
    "completed": 1,
    "pending": 1,
    "inProgress": 1,
    "overdue": 0,
    "byPriority": {
      "low": 0,
      "medium": 1,
      "high": 1,
      "urgent": 1
    },
    "byCategory": {
      "Work": 2,
      "Design": 1
    }
  }
}
```

---

## 3. List Todos (Filtered & Paginated)
* **Endpoint**: `GET /todos`
* **Query Parameters**:
  * `search` (string): Text search across title, description, and category.
  * `status` (string): Filter by `'pending'`, `'in_progress'`, or `'completed'`.
  * `priority` (string): Filter by `'low'`, `'medium'`, `'high'`, or `'urgent'`.
  * `category` (string): Filter by category name.
  * `sortBy` (string): Sort column (`'createdAt'`, `'dueDate'`, `'priority'`, `'title'`). Default: `'createdAt'`.
  * `order` (string): Sort direction (`'asc'` or `'desc'`). Default: `'desc'`.
  * `page` (number): Page number (Default: 1).
  * `limit` (number): Items per page (Default: 10).
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "e8a15993-96b6-455b-9b43-9828236df96f",
      "title": "Review Ziptrrip Tech Assignment Code",
      "description": "Ensure full coverage for MPA requirements, Express APIs, Unit Tests, and documentation.",
      "status": "in_progress",
      "priority": "urgent",
      "category": "Work",
      "dueDate": "2026-07-28T13:40:00.000Z",
      "createdAt": "2026-07-27T13:40:00.000Z",
      "updatedAt": "2026-07-27T13:40:00.000Z",
      "tags": ["ziptrrip", "assignment", "urgent"],
      "subtasks": [
        {
          "id": "st-101",
          "todoId": "e8a15993-96b6-455b-9b43-9828236df96f",
          "title": "Check Express CRUD Endpoints",
          "completed": true,
          "createdAt": "2026-07-27T13:40:00.000Z"
        }
      ]
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "totalPages": 1,
    "limit": 10
  }
}
```

---

## 4. Get Single Todo by ID
* **Endpoint**: `GET /todos/:id`
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "e8a15993-96b6-455b-9b43-9828236df96f",
    "title": "Review Ziptrrip Tech Assignment Code",
    "description": "Ensure full coverage for MPA requirements...",
    "status": "in_progress",
    "priority": "urgent",
    "category": "Work",
    "dueDate": "2026-07-28T13:40:00.000Z",
    "createdAt": "2026-07-27T13:40:00.000Z",
    "updatedAt": "2026-07-27T13:40:00.000Z",
    "tags": ["ziptrrip", "assignment"],
    "subtasks": []
  }
}
```
* **Response (404 Not Found)**:
```json
{
  "success": false,
  "error": "Todo with ID 'invalid-id' not found"
}
```

---

## 5. Create New Todo
* **Endpoint**: `POST /todos`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "title": "Build Ziptrrip Frontend",
  "description": "Build Next.js MPA pages for /todos and /todo?id=",
  "status": "pending",
  "priority": "high",
  "category": "Development",
  "dueDate": "2026-08-01T12:00:00.000Z",
  "tags": ["frontend", "mpa"],
  "subtasks": [
    { "title": "Setup Next.js pages", "completed": false }
  ]
}
```
* **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": { ... }
}
```

---

## 6. Update Todo
* **Endpoint**: `PUT /todos/:id`
* **Request Body**: Partial or complete todo fields (`title`, `description`, `status`, `priority`, `category`, `dueDate`, `tags`).
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": { ... }
}
```

---

## 7. Quick Status Patch
* **Endpoint**: `PATCH /todos/:id/status`
* **Request Body**: `{ "status": "completed" }`
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Todo status changed to 'completed'",
  "data": { ... }
}
```

---

## 8. Delete Todo
* **Endpoint**: `DELETE /todos/:id`
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": {
    "success": true,
    "id": "e8a15993-96b6-455b-9b43-9828236df96f"
  }
}
```

---

## 9. Subtask Endpoints
* **Add Subtask**: `POST /todos/:id/subtasks` — `{ "title": "Subtask title", "completed": false }`
* **Update Subtask**: `PATCH /todos/subtasks/:subtaskId` — `{ "title": "Updated title", "completed": true }`
* **Delete Subtask**: `DELETE /todos/subtasks/:subtaskId`
