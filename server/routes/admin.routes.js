const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const adminOnly = [authenticate, authorize('admin')];

router.get('/stats', ...adminOnly, adminController.getStats);
router.get('/users', ...adminOnly, adminController.getUsers);
router.patch('/users/:id/toggle-status', ...adminOnly, adminController.toggleUserStatus);
router.delete('/users/:id', ...adminOnly, adminController.deleteUser);
router.get('/jobs', ...adminOnly, adminController.getJobs);
router.patch('/jobs/:id/status', ...adminOnly, adminController.updateJobStatus);
router.delete('/jobs/:id', ...adminOnly, adminController.deleteJob);

module.exports = router;
