# 🚀 Zidra Job Portal

> Somalia's #1 Full-Stack Job Portal — Connecting Talent with Opportunity

![Zidra Job Portal](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/CSS-TailwindCSS-06B6D4?logo=tailwindcss)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Design](#database-design)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Deployment](#deployment)

---

## 🎯 Overview

**Zidra Job Portal** is a production-ready, full-stack web application that connects job seekers with employers in Somalia and beyond. It supports three distinct user roles — Applicant, Employer, and Admin — each with their own dashboard and feature set.

---

## ✨ Features

### 👤 Applicant (Job Seeker)
- ✅ Register & login with JWT authentication
- ✅ Create & update personal profile
- ✅ Upload CV (PDF only, max 5MB, stored locally)
- ✅ Search & filter job listings
- ✅ Apply for jobs with CV + cover letter
- ✅ Track application status (pending/reviewing/accepted/rejected)
- ✅ Bookmark/save jobs
- ✅ View full application history

### 🏢 Employer (Company)
- ✅ Register & create company profile
- ✅ Post new job listings
- ✅ Edit & delete own job posts
- ✅ View all applicants per job
- ✅ Download applicant CVs
- ✅ Accept/reject/review applications
- ✅ View job performance stats (views, applications)

### 👨‍💼 Admin
- ✅ Secure admin dashboard
- ✅ View all users & jobs
- ✅ Approve or reject job posts
- ✅ Block/unblock user accounts
- ✅ Delete users or jobs
- ✅ System analytics & reporting

### 🌟 Extra Features
- ✅ Dark mode toggle
- ✅ Loading skeletons
- ✅ Email notifications (registration, application status)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ 404 & 500 error pages
- ✅ SEO-friendly pages
- ✅ Rate limiting & security headers
- ✅ Job pagination & sorting

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Tailwind CSS, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL + Sequelize ORM |
| Auth | JWT + bcryptjs |
| File Upload | Multer (local storage) |
| Email | Nodemailer (Gmail SMTP) |
| Security | Helmet, express-rate-limit, express-validator |

---

## 🗄️ Database Design

```
users          → id, name, email, password, role, phone, location, bio, skills, cv_path, is_active
companies      → id, company_name, location, description, website, industry, owner_id (FK→users)
jobs           → id, title, description, location, salary_min, salary_max, job_type, status, company_id (FK→companies)
applications   → id, job_id (FK→jobs), user_id (FK→users), cv_file_path, cover_letter, status
saved_jobs     → id, user_id (FK→users), job_id (FK→jobs)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm v9+

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/zidra-job-portal.git
cd zidra-job-portal
```

### 2. Set Up the Database

```sql
CREATE DATABASE zidra_db;
CREATE USER zidra_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE zidra_db TO zidra_user;
```

### 3. Configure Backend Environment

```bash
cd server
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zidra_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

### 4. Install Dependencies & Start

```bash
# From root directory
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Start both (from root)
cd ..
npm run dev
```

Or individually:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm start
```

### 5. Access the Application

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Frontend (React) |
| http://localhost:5000/api | Backend API |
| http://localhost:5000/api/health | Health check |

### 6. Default Admin Account

```
Email:    admin@zidra.com
Password: Admin@1234
```

> ⚠️ Change the admin password immediately in production!

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| PUT | `/auth/change-password` | Change password | ✅ |

### Jobs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/jobs` | List approved jobs (with filters) | ❌ |
| GET | `/jobs/:id` | Get job details | ❌ |
| POST | `/jobs` | Create job | Employer |
| PUT | `/jobs/:id` | Update job | Employer |
| DELETE | `/jobs/:id` | Delete job | Employer |
| GET | `/jobs/employer/my-jobs` | Get employer's jobs | Employer |
| GET | `/jobs/:id/applicants` | Get job applicants | Employer |

**Job Search Parameters:**
```
GET /jobs?search=engineer&location=mogadishu&job_type=full-time&page=1&limit=10
```

### Applications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/applications/:jobId/apply` | Apply for job (multipart/form-data) | Applicant |
| GET | `/applications/my` | My applications | Applicant |
| PATCH | `/applications/:id/status` | Update status | Employer |
| GET | `/applications/:id/download-cv` | Download CV | Employer |

### Companies

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/companies/my` | Get my company | Employer |
| POST | `/companies` | Create company | Employer |
| PUT | `/companies/my` | Update company | Employer |
| GET | `/companies/:id` | Get company by ID | ❌ |

### Saved Jobs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/saved-jobs` | Get saved jobs | Applicant |
| POST | `/saved-jobs/:jobId` | Toggle save/unsave | Applicant |
| GET | `/saved-jobs/:jobId/status` | Check save status | Applicant |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/stats` | Dashboard analytics | Admin |
| GET | `/admin/users` | All users | Admin |
| PATCH | `/admin/users/:id/toggle-status` | Block/unblock user | Admin |
| DELETE | `/admin/users/:id` | Delete user | Admin |
| GET | `/admin/jobs` | All jobs | Admin |
| PATCH | `/admin/jobs/:id/status` | Approve/reject job | Admin |
| DELETE | `/admin/jobs/:id` | Delete job | Admin |

---

## 📁 Project Structure

```
zidra-job-portal/
├── server/                    # Backend (Node.js + Express)
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── job.controller.js
│   │   ├── application.controller.js
│   │   ├── company.controller.js
│   │   ├── user.controller.js
│   │   ├── savedJob.controller.js
│   │   └── admin.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── job.routes.js
│   │   ├── application.routes.js
│   │   ├── company.routes.js
│   │   ├── user.routes.js
│   │   ├── savedJob.routes.js
│   │   └── admin.routes.js
│   ├── models/
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── SavedJob.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── validation.middleware.js
│   │   └── email.service.js
│   ├── uploads/cvs/           # Local CV storage
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── client/                    # Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── JobCard.js
│   │   │   │   ├── LoadingSpinner.js
│   │   │   │   └── Skeleton.js
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.js
│   │   │   │   └── Footer.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── pages/
│   │   │   ├── auth/         (Login, Register)
│   │   │   ├── public/       (Home, Jobs, JobDetail, ErrorPages)
│   │   │   ├── applicant/    (Dashboard, Profile, AppliedJobs, SavedJobs)
│   │   │   ├── employer/     (Dashboard, PostJob, MyJobs, Applicants, CompanyProfile)
│   │   │   └── admin/        (Dashboard, ManageUsers, ManageJobs)
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── package.json               # Root monorepo scripts
├── .gitignore
└── README.md
```

---

## 🔒 Security Features

- JWT token authentication with expiration
- bcrypt password hashing (12 rounds)
- Role-based access control (RBAC)
- Rate limiting (200 req/15min global, 20 req/15min auth)
- Security headers via Helmet.js
- Input validation & sanitization
- PDF-only file upload validation
- File size limit enforcement
- CORS protection

---

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate an App Password for "Mail"
4. Use it as `EMAIL_PASS` in your `.env`

---

## 🌍 Deployment

### Backend (Ubuntu/Linux)

```bash
# Install PM2
npm install -g pm2

# Start server
cd server
pm2 start server.js --name "zidra-api"
pm2 startup
pm2 save
```

### Frontend

```bash
cd client
npm run build
# Serve the build/ folder via Nginx or any static host
```

### Nginx Config Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/zidra/client/build;
        try_files $uri /index.html;
    }
}
```

---

## 👨‍💻 Author

Built with ❤️ for Somalia's growing tech ecosystem.

---

## 📄 License

MIT License — feel free to use this project for your portfolio or commercial purposes.
