require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');

// ============================================================
// SECURITY: Validate required environment variables on startup
// ============================================================
const REQUIRED_ENV = ['JWT_SECRET'];
REQUIRED_ENV.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const companyRoutes = require('./routes/company.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const savedJobRoutes = require('./routes/savedJob.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ============================================================
// SECURITY 1: Helmet — HTTP security headers
// ============================================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// ============================================================
// SECURITY 2: Hide server info
// ============================================================
app.disable('x-powered-by');

// ============================================================
// SECURITY 3: Rate Limiting — DDoS & Brute Force protection
// ============================================================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  skip: (req) => req.ip === '127.0.0.1'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Stricter: 10 attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' }
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20, // Max 20 uploads per hour
  message: { success: false, message: 'Upload limit reached. Try again in an hour.' }
});

app.use('/api/', globalLimiter);

// ============================================================
// SECURITY 4: CORS — Only allow frontend origin
// ============================================================
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
].filter(Boolean).map(o => o.replace(/\/+$/, '')); // remove trailing slash

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(cleanOrigin)) return callback(null, true);
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') return callback(null, true);
    callback(new Error('CORS: Origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

// ============================================================
// SECURITY 5: Body size limits — prevent large payload attacks
// ============================================================
app.use(express.json({ limit: '1mb' }));         // Reduced from 10mb
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ============================================================
// SECURITY 6: Logging (no sensitive data in production)
// ============================================================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400 // Only log errors in production
  }));
}

// ============================================================
// SECURITY 7: Static files — NO directory listing, auth required
// ============================================================
// CVs are NOT served statically — only via authenticated /download-cv endpoint
// This prevents unauthenticated access to uploaded CVs

// ============================================================
// API Routes
// ============================================================
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', uploadLimiter, applicationRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/admin', adminRoutes);

// Health check — no sensitive info exposed
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

// ============================================================
// SECURITY 8: Block all unknown routes (no info leakage)
// ============================================================
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found.' });
});

// ============================================================
// SECURITY 9: Global error handler — never leak stack traces
// ============================================================
app.use((err, req, res, next) => {
  // Log full error server-side only
  console.error(`[ERROR] ${new Date().toISOString()} ${req.method} ${req.path}:`, err.message);

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  const statusCode = err.statusCode || 500;

  // Never expose stack traces or internal errors to client in production
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : statusCode === 500 ? 'Internal server error.' : err.message
  });
});

const PORT = process.env.PORT || 5000;

// ============================================================
// Start Server
// ============================================================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized');

    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Zidra Server running on port ${PORT}`);
      console.log(`🔒 Security: Helmet, Rate Limiting, CORS, Input Validation enabled`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// ============================================================
// SECURITY: Default admin password from env variable
// ============================================================
const createDefaultAdmin = async () => {
  const { User } = require('./models');
  const bcrypt = require('bcryptjs');

  const adminExists = await User.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@1234';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await User.create({
      name: 'Zidra Admin',
      email: process.env.ADMIN_EMAIL || 'admin@zidra.com',
      password: hashedPassword,
      role: 'admin',
      is_active: true
    });
    console.log('✅ Default admin account created');
  }
};

startServer();
