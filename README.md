# JobTrackr — AI-Powered Job Application Tracker

A full-stack MERN + TypeScript web app to track job applications on a drag-and-drop Kanban board, with an AI feature that parses job descriptions and suggests resume bullet points.

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication (bcryptjs)
- OpenAI API (GPT-3.5-turbo) for JD parsing

**Frontend**
- React 18 + TypeScript
- Vite (dev server + build tool)
- Tailwind CSS (utility-first styling)
- @dnd-kit (drag and drop)
- TanStack Query v5 (server state)
- Zustand (client state / auth)
- React Router v6
- Axios + react-hot-toast

---

## Project Structure

```
job-tracker/
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB connection
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # JWT auth middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routers
│   │   ├── services/     # OpenAI service logic
│   │   ├── types/        # Shared TypeScript types
│   │   └── index.ts      # Express app entry
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── board/    # Kanban, cards, modals, navbar
    │   │   └── ui/       # Reusable Modal, StatusBadge
    │   ├── hooks/        # TanStack Query hooks
    │   ├── pages/        # LoginPage, RegisterPage, BoardPage
    │   ├── services/     # Axios API calls
    │   ├── store/        # Zustand auth store
    │   ├── types/        # TypeScript interfaces
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI
- OpenAI API key (optional — only needed for AI parsing feature)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=pick_any_long_random_string
OPENAI_API_KEY=sk-your-openai-key    # optional
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Features

- **Auth** — Register / login with JWT. Tokens stored in localStorage, auto-attached to every request.
- **Kanban Board** — Five columns: Applied → Phone Screen → Interview → Offer → Rejected. Drag cards between columns to update status instantly.
- **Add Application** — Fill in company, role, salary, date, notes. Status pre-set to Applied.
- **AI JD Parser** — Paste a job description, click "Parse with AI". Extracts required skills, nice-to-have skills, seniority, location, and auto-fills the form. Also generates 4 tailored resume bullet points you can save with the application.
- **Search** — Filter cards live by company name, role, or skill.
- **Stats Bar** — Shows count per column and overall response rate.
- **Edit / Delete** — Click any card to view full details, edit fields, or delete with a confirmation step.

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Applications (all protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/applications` | Get all (current user) |
| GET | `/api/applications/:id` | Get one |
| POST | `/api/applications` | Create |
| PUT | `/api/applications/:id` | Full update |
| PATCH | `/api/applications/:id/status` | Status only |
| DELETE | `/api/applications/:id` | Delete |

### AI (protected)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/parse` | Parse JD, return skills + suggestions |

---

## Deployment

**Backend** — Deploy to Render, Railway, or any Node host. Set env vars in the dashboard.

**Frontend** — Run `npm run build` in the frontend folder. Deploy the `dist/` folder to Vercel, Netlify, or any static host. Set `VITE_API_URL` if needed, or update the Vite proxy config for production.

---

## Author

Built by [Sanjay](https://github.com/yourusername)
