const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJob.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, authorize('applicant'), savedJobController.getSavedJobs);
router.post('/:jobId', authenticate, authorize('applicant'), savedJobController.toggleSaveJob);
router.get('/:jobId/status', authenticate, authorize('applicant'), savedJobController.getSaveStatus);

module.exports = router;
