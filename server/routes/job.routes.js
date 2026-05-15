const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { jobValidator, validate } = require('../middlewares/validation.middleware');

// Public routes
router.get('/', jobController.getJobs);
router.get('/employer/my-jobs', authenticate, authorize('employer'), jobController.getMyJobs);
router.get('/:id', jobController.getJob);
router.get('/:id/applicants', authenticate, authorize('employer'), jobController.getJobApplicants);

// Employer routes
router.post('/', authenticate, authorize('employer'), jobValidator, validate, jobController.createJob);
router.put('/:id', authenticate, authorize('employer'), jobController.updateJob);
router.delete('/:id', authenticate, authorize('employer'), jobController.deleteJob);

module.exports = router;
