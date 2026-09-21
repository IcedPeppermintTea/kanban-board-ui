# Kanban Board

A three-column Kanban board (To Do, In Progress, Done) with drag-and-drop task management.

[Live Demo](https://icedpepperminttea.github.io/kanban-board-ui/)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)

---

## About

A drag-and-drop task management board built with React and TypeScript. Tasks can be created, moved between columns, and deleted. Includes a full backend — a REST API built with Node.js and Express, backed by a SQLite database — so tasks persist across sessions instead of resetting on refresh.

![Kanban Board](src/assets/kanban_1.jpeg)

## Features

- **Three-column layout** — To Do, In Progress, and Done
- **Drag and drop** — move tasks between columns or reorder within a column
- **Add tasks** — create tasks with a title, priority level, and due date
- **Delete tasks** — remove tasks with a single click
- **Priority labels** — High, Medium, and Low with color coding
- **Persistent storage** — tasks are saved to a database via a custom REST API, so your board survives page refreshes

## Getting Started

### Prerequisites

**Frontend** (this repo)

- **React 19** — component architecture, useState, props, lifting state up
- **TypeScript** — type safety with interfaces and custom types
- **Tailwind CSS v4** — utility-first styling
- **@hello-pangea/dnd** — drag and drop
- **Vite** — build tool and dev server
- Vite — build tool and dev server

**Backend**

- See [kanban-board-api](https://github.com/IcedPeppermintTea/kanban-board-api) — Node.js, Express, SQLite

### Installation

```bash
# clone the repo
git clone https://github.com/your-username/kanban-board.git

# navigate into the project
cd kanban-board

# install dependencies
npm install

# start the dev server
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Project Structure

```
src/
├── components/
│   ├── Board.tsx        # renders the three columns
│   ├── Column.tsx       # renders tasks within a column
│   ├── TaskCard.tsx     # renders an individual task card
│   ├── AddTaskForm.tsx  # form to create a new task
│   └── DeleteTaskCard.tsx # delete button for a task
├── App.tsx              # state management and drag and drop logic
├── main.tsx             # entry point
└── index.css            # global styles
```

## Roadmap

- [ ] Edit existing tasks
- [ ] Add a description section for each task
- [x] Persist data with localStorage or full backend support so tasks survive a page refresh
- [ ] Add a fourth column or custom column names
- [ ] User authentication with saved boards
- [ ] BUG FIX: task priority label not saving
- [ ] BUG FIX: task due date label not saving
