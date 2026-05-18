# 🚀 Zidra Job Portal — Quick Setup Guide

## Prerequisites
- Node.js v18+
- PostgreSQL installed and running

## Step 1: PostgreSQL Database

Open pgAdmin or psql and run:
```sql
CREATE DATABASE zidra_db;
```

## Step 2: Backend Setup

```bash
cd server
cp .env.example .env
```

Open `.env` and set **only these 2 fields**:
```
DB_PASSWORD=your_postgres_password
JWT_SECRET=any_random_long_string_here
```

Then:
```bash
npm install
npm run dev
```

✅ You should see:
```
✅ Database connected successfully
✅ Database synchronized
✅ Default admin created: admin@zidra.com / Admin@1234
🚀 Zidra Server running on port 5000
```

## Step 3: Frontend Setup

Open a **new terminal**:
```bash
cd client
npm install
npm start
```

Browser opens at: **http://localhost:3000**

## Step 4: Login

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@zidra.com     | Admin@1234 |

## Common Issues

**"password authentication failed"**
→ Wrong DB_PASSWORD in `.env`. Check your PostgreSQL password.

**"recharts not found"**
→ Run `npm install` in the client folder again.

**Frontend can't reach backend**
→ Make sure server is running on port 5000
→ Check `.env` has `CLIENT_URL=http://localhost:3000`
