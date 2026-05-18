const express = require('express');
const router = express.Router();
const appController = require('../controllers/application.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { upload, handleUploadError } = require('../middlewares/upload.middleware');

router.post('/:jobId/apply', authenticate, authorize('applicant'), upload.single('cv'), handleUploadError, appController.applyForJob);
router.get('/my', authenticate, authorize('applicant'), appController.getMyApplications);
router.patch('/:id/shortlist', authenticate, authorize('employer'), appController.shortlistApplication);
router.patch('/:id/status', authenticate, authorize('employer'), appController.updateApplicationStatus);
router.get('/:id/download-cv', authenticate, authorize('employer'), appController.downloadCV);

module.exports = router;
