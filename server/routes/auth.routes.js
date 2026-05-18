const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const forgotPasswordController = require('../controllers/forgotPassword.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { registerValidator, loginValidator, validate } = require('../middlewares/validation.middleware');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/me', authenticate, authController.getMe);
router.put('/change-password', authenticate, authController.changePassword);

// Forgot / Reset password
router.post('/forgot-password', forgotPasswordController.forgotPassword);
router.post('/reset-password', forgotPasswordController.resetPassword);
router.get('/verify-reset-token', forgotPasswordController.verifyResetToken);

module.exports = router;
