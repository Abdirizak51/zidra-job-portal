require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');

// ── Validate required env vars ────────────────────────────────
const REQUIRED_ENV = ['JWT_SECRET'];
REQUIRED_ENV.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ FATAL: Missing env var: ${key}`);
    process.exit(1);
  }
});

// ── Route imports ─────────────────────────────────────────────
const authRoutes        = require('./routes/auth.routes');
const userRoutes        = require('./routes/user.routes');
const companyRoutes     = require('./routes/company.routes');
const jobRoutes         = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const savedJobRoutes    = require('./routes/savedJob.routes');
const adminRoutes       = require('./routes/admin.routes');

const app = express();

// ── 1. Helmet security headers ────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // disabled — frontend handles CSP
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
app.disable('x-powered-by');

// ── 2. Rate limiting ──────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' }
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Upload limit reached. Try again in an hour.' }
});

app.use('/api/', globalLimiter);

// ── 3. CORS — allow all origins (Somalia + worldwide) ─────────
// JWT handles security — CORS just prevents browser blocks
app.use(cors({
  origin: true,           // allow ALL origins worldwide
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // fix for older browsers/mobile
}));

// Handle preflight requests explicitly
app.options('*', cors());

// ── 4. Body parsing ───────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── 5. Logging ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400
  }));
}

// ── 6. API Routes ─────────────────────────────────────────────
app.use('/api/auth',         authLimiter,   authRoutes);
app.use('/api/users',                       userRoutes);
app.use('/api/companies',                   companyRoutes);
app.use('/api/jobs',                        jobRoutes);
app.use('/api/applications', uploadLimiter, applicationRoutes);
app.use('/api/saved-jobs',                  savedJobRoutes);
app.use('/api/admin',                       adminRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} ${req.method} ${req.path}:`, err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : statusCode >= 500 ? 'Internal server error.' : err.message
  });
});

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized');

    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Zidra Server running on port ${PORT}`);
      console.log(`🔒 Security: Helmet, Rate Limiting, JWT enabled`);
      console.log(`🌍 CORS: Open for all origins`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  const { User } = require('./models');
  const bcrypt   = require('bcryptjs');

  const adminExists = await User.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@1234';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await User.create({
      name:     'Zidra Admin',
      email:    process.env.ADMIN_EMAIL || 'admin@zidra.com',
      password: hashedPassword,
      role:     'admin',
      is_active: true
    });
    console.log('✅ Default admin account created');
  }
};

startServer();
