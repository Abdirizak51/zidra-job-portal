const { SavedJob, Job, Company } = require('../models');

// GET /api/saved-jobs - Get user's saved jobs
exports.getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Job,
        as: 'job',
        where: { status: 'approved' },
        required: false,
        include: [{ model: Company, as: 'company', attributes: ['company_name', 'logo_url', 'location'] }]
      }],
      order: [['saved_at', 'DESC']]
    });

    res.json({ success: true, data: { savedJobs } });
  } catch (error) {
    next(error);
  }
};

// POST /api/saved-jobs/:jobId - Save a job (toggle)
exports.toggleSaveJob = async (req, res, next) => {
  try {
    const existing = await SavedJob.findOne({
      where: { user_id: req.user.id, job_id: req.params.jobId }
    });

    if (existing) {
      await existing.destroy();
      return res.json({ success: true, message: 'Job removed from saved.', data: { saved: false } });
    }

    const job = await Job.findByPk(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    await SavedJob.create({ user_id: req.user.id, job_id: req.params.jobId });
    res.status(201).json({ success: true, message: 'Job saved!', data: { saved: true } });
  } catch (error) {
    next(error);
  }
};

// GET /api/saved-jobs/:jobId/status - Check if job is saved
exports.getSaveStatus = async (req, res, next) => {
  try {
    const saved = await SavedJob.findOne({
      where: { user_id: req.user.id, job_id: req.params.jobId }
    });
    res.json({ success: true, data: { saved: !!saved } });
  } catch (error) {
    next(error);
  }
};
