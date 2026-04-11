# JobTrackr — AI-Powered Job Application Tracker

<div align="center">

![JobTrackr](https://img.shields.io/badge/JobTrackr-AI%20Powered-4f6ef7?style=for-the-badge&logo=briefcase)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

**A full-stack MERN + TypeScript web app to track job applications on a drag-and-drop Kanban board, with AI that parses job descriptions and generates resume bullet points.**

[🚀 Live Demo](https://job-tracker-sanjay05.vercel.app) · [📦 Backend API](https://job-tracker-cazr.onrender.com/api/health) · [👤 Author](https://github.com/sanjayjat354339-cell)

</div>

---

## 📸 Preview

> Register → Add applications → Drag across columns → Use AI to parse JDs and get resume suggestions.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with bcryptjs password hashing
- 📋 **Kanban Board** — 5 columns: Applied → Phone Screen → Interview → Offer → Rejected
- 🖱️ **Drag & Drop** — Move cards between columns instantly using @dnd-kit
- 🤖 **AI JD Parser** — Paste a job description, AI extracts required skills, nice-to-have skills, seniority, location and auto-fills the form
- 📝 **Resume Bullet Generator** — AI generates 4 tailored resume bullet points per job
- 🔍 **Live Search** — Filter cards by company, role, or skill in real time
- 📊 **Stats Bar** — See total applications and response rate at a glance
- ✏️ **Edit & Delete** — Click any card to view full details, edit, or delete with confirmation
- 📱 **Responsive** — Works on mobile and desktop

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| @dnd-kit | Drag and drop |
| TanStack Query v5 | Server state management |
| Zustand | Client state (auth) |
| React Router v6 | Routing |
| Axios | HTTP client |
| react-hot-toast | Notifications |
| lucide-react | Icons |
| date-fns | Date formatting |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | Server framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| OpenAI API | AI JD parsing & resume suggestions |
| CORS + dotenv | Config & security |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

```
job-tracker/
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # auth, application, AI handlers
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── models/         # User & Application schemas
│   │   ├── routes/         # Express routers
│   │   ├── services/       # OpenAI service logic
│   │   ├── types/          # Shared TypeScript types
│   │   └── index.ts        # Express app entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── board/      # Kanban, cards, modals, navbar, stats
    │   │   └── ui/         # Modal, StatusBadge
    │   ├── hooks/          # TanStack Query hooks
    │   ├── pages/          # LoginPage, RegisterPage, BoardPage
    │   ├── services/       # Axios API calls
    │   ├── store/          # Zustand auth store
    │   ├── types/          # TypeScript interfaces
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI
- OpenAI API key (optional — only for AI features)

### 1. Clone the repo

```bash
git clone https://github.com/sanjayjat354339-cell/Job-tracker.git
cd Job-tracker
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=sk-your-key-here
CLIENT_URL=http://localhost:5173
```

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

## 🌐 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Applications (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/applications` | Get all applications |
| GET | `/api/applications/:id` | Get single application |
| POST | `/api/applications` | Create application |
| PUT | `/api/applications/:id` | Update application |
| PATCH | `/api/applications/:id/status` | Update status only |
| DELETE | `/api/applications/:id` | Delete application |

### AI (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/parse` | Parse JD, return skills + resume suggestions |

---

## 🔗 Deployment

| | URL |
|--|--|
| **Frontend** | https://job-tracker-sanjay05.vercel.app |
| **Backend** | https://job-tracker-cazr.onrender.com |
| **Health Check** | https://job-tracker-cazr.onrender.com/api/health |

> ⚠️ The backend is hosted on Render's free tier — it may take 30–60 seconds to wake up on the first request after inactivity.

---

## 👤 Author

**Sanjay Jat**

- GitHub: [@sanjayjat354339-cell](https://github.com/sanjayjat354339-cell)
- Project: [Job-tracker](https://github.com/sanjayjat354339-cell/Job-tracker)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
