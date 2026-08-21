# 🎓 Student Task Manager

A modern, responsive task management web application built specifically for students to track academic assignments, manage project deadlines, and organize daily study schedules.

---

## ✨ Features

- **Task & Assignment Tracking:** Create, edit, and categorize tasks with deadlines, subjects, and priorities.
- **Status Workflow:** Monitor task progress through stages (*To Do*, *In Progress*, *Completed*).
- **Responsive Dashboard:** Optimized layout built for smooth navigation on mobile, tablet, and desktop screens.
- **Modern UI Components:** Clean, accessible styling built with Tailwind CSS and Radix/shadcn UI components.
- **Fast Build Times:** Powered by Vite and TypeScript for rapid development and runtime performance.

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Bundler & Tooling:** [Vite](https://vitejs.dev/), [ESLint](https://eslint.org/)
- **Package Management:** [npm](https://www.npmjs.com/) / [Bun](https://bun.sh/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have one of the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher) & npm
- [Bun](https://bun.sh/) (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/tasleem1355/TASKMANAGER.git](https://github.com/tasleem1355/TASKMANAGER.git)
   cd TASKMANAGER
2. Install dependencies:

Bash
npm install
# or with bun:
bun install
3. Start the local development server:

Bash
npm run dev
# or with bun:
bun dev
4.Open your browser and navigate to http://localhost:5173.

📦 Building for Production
To create an optimized production build:

Bash
npm run build
# or with bun:
bun run build
Preview the production build locally:

Bash
npm run preview
📂 Project Structure
Plaintext
TASKMANAGER/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI elements & widgets
│   ├── context/         # React context providers & state
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application views & pages
│   ├── types/           # TypeScript interfaces & types
│   ├── utils/           # Helper functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # React entry point
├── components.json      # shadcn/ui configuration
├── package.json         # Project metadata and dependencies
├── postcss.config.js    # PostCSS pipeline configuration
├── tailwind.config.js   # Tailwind design tokens & themes
└── vite.config.ts       # Vite bundler
