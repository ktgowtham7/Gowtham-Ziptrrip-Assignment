# Ziptrrip Tech Assignment - Full-Stack Todo Application (MPA & REST API)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue.svg)](https://www.sqlite.org/)
[![Next.js MPA](https://img.shields.io/badge/Next.js-14.2%20MPA-black.svg)](https://nextjs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit%20Tests-yellow.svg)](https://vitest.dev/)

A production-grade, feature-rich Full-Stack Todo Application built specifically for the **Ziptrrip Backend Engineer Tech Assignment**.

The application features a robust **TypeScript Express REST API server**, an **SQLite database**, complete **Vitest unit tests**, **Postman Collections & REST Client files**, and a modern **React Multi-Page Application (MPA)** built with Next.js & TypeScript.

---

## 🌟 Key Features & Highlights

### ⚡ Backend Features (`/backend`)
* **TypeScript & Clean Architecture**: Controller-Service-Repository multi-layered design.
* **SQLite Relational Database**: Persistent database with indexes on status, priority, category, and cascading delete for subtasks.
* **RESTful CRUD APIs**: Complete set of endpoints for Todos, Subtasks, and Summary Statistics.
* **Advanced Query Engine**: Full support for text search, filtering (status, priority, category), multi-field sorting (`createdAt`, `dueDate`, `priority`, `title`), and pagination.
* **Zod Input Validation**: Strict request schema validation middleware.
* **Unit Test Suite**: 100% passing unit tests built with Vitest covering services, controllers, and edge cases.
* **Postman & REST Client Files**: Ready-to-use `ziptrrip_todos.postman_collection.json` and `api_requests.http` for immediate testing.

### 🎨 Frontend Features (`/frontend`)
* **Multi-Page Application (MPA)**: Renders independent page document routes for `/todos` and `/todo?id=<todo_id>`.
* **Page 1: Todo Dashboard (`/todos`)**:
  * Live search, multi-filter dropdowns, sorting selector, items-per-page.
  * Interactive Todo cards with status badges, priority badges, category tags, due date indicators, and subtask progress bar.
  * Statistics banner (Total, Completed, In Progress, Overdue counts, and progress bar).
  * Modal drawer for creating and updating Todo items with subtasks.
  * Light & Dark Mode visual theme switcher.
* **Page 2: Single Todo Detail View (`/todo?id=<todo_id>`)**:
  * Consumes query parameter `id` as required by the assignment prompt (`/todo?id=123`).
  * Displays full detail view: ID metadata, created/updated timestamps, target due date countdown, tags, description.
  * Interactive subtasks checklist with subtask creation, toggle completion, and deletion directly on the page.

---

## 📁 Repository Structure

```
Gowtham-Ziptrrip-Assignment/
├── backend/
│   ├── data/                   # SQLite database directory (todos.db)
│   ├── src/
│   │   ├── controllers/        # Express HTTP controllers
│   │   ├── services/           # Business logic layer
│   │   ├── repositories/       # SQLite database query repository
│   │   ├── routes/             # API route definitions
│   │   ├── middlewares/        # Error handler & Zod validation
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── types/              # TypeScript interface definitions
│   │   ├── db/                 # SQLite database initialization & seed
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # Server entry point
│   ├── tests/                  # Vitest unit test suite
│   ├── ziptrrip_todos.postman_collection.json  # Postman Collection
│   ├── api_requests.http       # REST Client file
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/
│   ├── src/
│   │   ├── components/         # React UI components (Cards, Modals, Nav, Filters, Stats)
│   │   ├── pages/
│   │   │   ├── index.tsx       # Redirects / to /todos
│   │   │   ├── todos.tsx       # Page 1: Todos Dashboard
│   │   │   └── todo.tsx        # Page 2: Single Todo Detail Page (?id=...)
│   │   ├── services/           # Axios API client
│   │   ├── styles/             # Dark/Light mode CSS variables
│   │   └── types/              # Shared TypeScript definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
├── README.md                   # Main Project Overview & Setup Guide
├── DOCUMENTATION.md            # Technical Architecture & Design Specification
├── API.md                      # Detailed REST API Endpoint Reference
└── Backend Engineer Tech questions assignment.txt # Assignment Prompt
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: `v18.x` or `v20.x` or `v22.x`
* **NPM**: `v9.x` or `v10.x`

---

### Step 1: Start Backend Server (`http://localhost:5000`)

```bash
cd backend
npm install
npm run dev
```

The backend server automatically initializes the SQLite database at `backend/data/todos.db` and seeds initial sample todos!

To run unit tests:
```bash
npm test
```

To build TypeScript output:
```bash
npm run build
```

---

### Step 2: Start Frontend Application (`http://localhost:3000`)

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open your browser and navigate to:
* **Dashboard Page (Page 1)**: [http://localhost:3000/todos](http://localhost:3000/todos)
* **Single Todo Page (Page 2)**: [http://localhost:3000/todo?id=YOUR_TODO_ID](http://localhost:3000/todo?id=YOUR_TODO_ID)

---

## 🧪 Testing APIs

1. **Postman**: Import `backend/ziptrrip_todos.postman_collection.json` into Postman.
2. **VS Code REST Client**: Open `backend/api_requests.http` and click "Send Request" above any API block.

---

## 📚 Documentation Files

- [Technical Architecture & Design Specification (`DOCUMENTATION.md`)](file:///c:/Users/Gowtham/Desktop/Gowtham-Ziptrrip-Assignment/DOCUMENTATION.md)
- [REST API Reference Guide (`API.md`)](file:///c:/Users/Gowtham/Desktop/Gowtham-Ziptrrip-Assignment/API.md)
