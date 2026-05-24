<div align="center">

<br/>

```
███████╗██╗██████╗ ██████╗  █████╗
╚══███╔╝██║██╔══██╗██╔══██╗██╔══██╗
  ███╔╝ ██║██║  ██║██████╔╝███████║
 ███╔╝  ██║██║  ██║██╔══██╗██╔══██║
███████╗██║██████╔╝██║  ██║██║  ██║
╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
```

### **AI-Driven Job Portal Platform**
*Connecting Talent with Opportunity — Built for Scale*

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-blue?style=for-the-badge)](https://abdirizakali.com)
[![GitHub Stars](https://img.shields.io/github/stars/Abdirizak51/zidra-job-portal?style=for-the-badge&logo=github)](https://github.com/Abdirizak51/zidra-job-portal/stargazers)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

</div>

---

## 🧭 Overview

**Zidra** is a full-stack job portal web application that bridges the gap between employers and job seekers with a clean, modern interface and a powerful, secure backend. Built with a **React** frontend and a **Node.js/Express** REST API backed by **PostgreSQL**, Zidra delivers a complete hiring ecosystem — from job posting to application tracking.

> *"I don't just write code; I design scalable products that convert complex logic into seamless user experiences."*

---

## ✨ Key Features

### 👤 For Job Seekers
- 🔍 **Browse & Search** job listings with advanced filters
- 📄 **Apply** to jobs with resume/file upload support
- 💾 **Save** favourite jobs for later review
- 📊 **Personal Dashboard** — track all your applications in one place
- 🙍 **Profile Management** — keep your info updated and professional

### 🏢 For Employers
- 📝 **Post Jobs** with rich descriptions, requirements, and categories
- 👥 **Review Applicants** — view profiles and manage candidates
- 🏗️ **Company Profile** — build your employer brand
- 📈 **Analytics Dashboard** — monitor your job listings performance

### 🛡️ For Admins
- 🗂️ **Manage All Users** — full CRUD with role management
- 🧹 **Content Moderation** — review and manage all job postings
- 📊 **System Overview** — real-time platform statistics

---

## 🏗️ Architecture & Tech Stack

```
zidra/
├── client/                  # React 18 Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/       # Admin Dashboard, ManageJobs, ManageUsers
│   │   │   ├── applicant/   # Dashboard, Profile, AppliedJobs, SavedJobs
│   │   │   ├── employer/    # Dashboard, PostJob, MyJobs, Applicants
│   │   │   └── public/      # Landing, Job Listings, Auth pages
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (Auth State)
│   │   └── services/        # Axios API service layer
│   └── tailwind.config.js
│
└── server/                  # Node.js + Express Backend API
    ├── controllers/         # Business logic handlers
    ├── models/              # Sequelize ORM models
    ├── routes/              # RESTful API routes
    ├── middlewares/         # Auth, validation, upload, email
    └── server.js            # Entry point
```

### Backend Stack
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Sequelize v6 |
| Auth | JWT (jsonwebtoken) |
| Security | Helmet, bcryptjs, express-rate-limit |
| File Uploads | Multer |
| Email | Nodemailer |
| Validation | express-validator |

### Frontend Stack
| Layer | Technology |
|-------|-----------|
| UI Library | React 18 |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Charts | Recharts |
| UI Components | Headless UI + Heroicons |
| Notifications | React Hot Toast |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `v18+`
- **PostgreSQL** `v14+`
- **npm** `v9+`

### 1. Clone the Repository

```bash
git clone https://github.com/Abdirizak51/zidra-job-portal.git
cd zidra-job-portal
```

### 2. Install All Dependencies

```bash
npm run install:all
```

> This installs dependencies for both `/server` and `/client` in one command.

### 3. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zidra_db
DB_USER=your_db_user
DB_PASS=your_db_password

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Email (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_password
```

### 4. Set Up the Database

```bash
# Run migrations
npm run db:migrate --prefix server

# (Optional) Seed sample data
npm run db:seed --prefix server
```

### 5. Run the Application

```bash
# Run both server and client concurrently
npm run dev
```

| Service | URL |
|---------|-----|
| 🖥️ Frontend | `http://localhost:3000` |
| ⚙️ Backend API | `http://localhost:5000` |

---

## 🔐 Security Features

- ✅ **JWT Authentication** with protected route middleware
- ✅ **Password Hashing** with bcryptjs
- ✅ **Rate Limiting** — global (300 req/15min) and auth routes (20 req/15min)
- ✅ **Helmet.js** — HTTP security headers (HSTS, noSniff, referrer policy)
- ✅ **Input Validation** — server-side with express-validator
- ✅ **CORS** — configured for controlled cross-origin access
- ✅ **Role-Based Access Control** — Admin / Employer / Applicant roles

---

## 📡 API Overview

```
POST   /api/auth/register        → Register new user
POST   /api/auth/login           → Login + receive JWT
POST   /api/auth/forgot-password → Password reset flow

GET    /api/jobs                 → List all jobs (public)
POST   /api/jobs                 → Create job (employer)
GET    /api/jobs/:id             → Single job details
PUT    /api/jobs/:id             → Update job (employer)
DELETE /api/jobs/:id             → Delete job (employer/admin)

POST   /api/applications         → Apply to a job
GET    /api/applications/me      → My applications
GET    /api/applications/job/:id → Job applicants (employer)

GET    /api/saved-jobs           → My saved jobs
POST   /api/saved-jobs/:id       → Save a job
DELETE /api/saved-jobs/:id       → Remove saved job

GET    /api/admin/users          → All users (admin)
GET    /api/admin/jobs           → All jobs (admin)
```

---

## 🗄️ Data Models

```
User          → id, name, email, password, role, avatar, createdAt
Company       → id, userId, name, logo, description, website, location
Job           → id, companyId, title, description, salary, type, status
Application   → id, jobId, userId, resumeUrl, status, appliedAt
SavedJob      → id, userId, jobId, savedAt
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend concurrently |
| `npm run dev:server` | Run backend only (with nodemon) |
| `npm run dev:client` | Run frontend only |
| `npm run build:client` | Build React for production |
| `npm run db:migrate` | Run Sequelize migrations |
| `npm run db:seed` | Seed the database |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 👨‍💻 Author

<div align="center">

**Abdirizak Ali**
*Full Stack Developer | Building Scalable Web Architectures*
📍 Somalia — Open for Global Collaborations

[![Portfolio](https://img.shields.io/badge/Portfolio-abdirizakali.com-blue?style=flat-square&logo=firefox)](https://abdirizakali.com)
[![Email](https://img.shields.io/badge/Email-abdirizack73@gmail.com-red?style=flat-square&logo=gmail)](mailto:abdirizakd73@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com)
[![GitHub](https://img.shields.io/badge/GitHub-Abdirizak51-181717?style=flat-square&logo=github)](https://github.com/Abdirizak51)

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ If you found this project helpful, please give it a star!**

*Built with ❤️ by [Abdirizak Ali](https://github.com/Abdirizak51)*

</div>
