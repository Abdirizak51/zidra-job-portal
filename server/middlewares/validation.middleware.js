const { body, validationResult } = require('express-validator');

// Handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('role').isIn(['applicant', 'employer']).withMessage('Role must be applicant or employer')
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

// Job validators
const jobValidator = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Job title required (3-200 chars)'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description required (min 20 chars)'),
  body('location').trim().notEmpty().withMessage('Location required'),
  body('job_type').isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']).withMessage('Invalid job type')
];

// Profile validators
const profileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('phone').optional().trim().isMobilePhone().withMessage('Valid phone number required'),
  body('location').optional().trim().isLength({ max: 150 }).withMessage('Location too long'),
  body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio too long (max 1000 chars)')
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  jobValidator,
  profileValidator
};
