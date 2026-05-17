const path = require('path');
const fs = require('fs');
const { Application, Job, Company, User } = require('../models');
const { sendEmail, emailTemplates } = require('../middlewares/email.service');

// POST /api/applications/:jobId/apply
exports.applyForJob = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'CV file (PDF) is required.' });
    }

    const job = await Job.findOne({
      where: { id: req.params.jobId, status: 'approved' },
      include: [{ model: Company, as: 'company' }]
    });

    if (!job) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Job not found or not available.' });
    }

    const existingApp = await Application.findOne({
      where: { job_id: req.params.jobId, user_id: req.user.id }
    });

    if (existingApp) {
      fs.unlinkSync(req.file.path);
      return res.status(409).json({ success: false, message: 'You have already applied for this job.' });
    }

    // SECURITY: Only store filename, not full path
    const application = await Application.create({
      job_id: req.params.jobId,
      user_id: req.user.id,
      cv_file_path: req.file.filename,
      cover_letter: req.body.cover_letter ? req.body.cover_letter.substring(0, 2000) : null,
      status: 'pending'
    });

    sendEmail(
      req.user.email,
      emailTemplates.applicationConfirmation(req.user.name, job.title, job.company.company_name)
    ).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: { application }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

// GET /api/applications/my
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Job,
        as: 'job',
        include: [{ model: Company, as: 'company', attributes: ['company_name', 'logo_url', 'location'] }]
      }],
      order: [['applied_at', 'DESC']]
    });

    res.json({ success: true, data: { applications } });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/:id/status
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, employer_notes } = req.body;
    const validStatuses = ['reviewing', 'accepted', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [
        { model: Job, as: 'job', include: [{ model: Company, as: 'company' }] },
        { model: User, as: 'applicant', attributes: ['name', 'email'] }
      ]
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || application.job.company_id !== company.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    // SECURITY: Sanitize employer notes
    const safeNotes = employer_notes ? employer_notes.substring(0, 500) : null;
    await application.update({ status, employer_notes: safeNotes });

    if (status === 'accepted' || status === 'rejected') {
      sendEmail(
        application.applicant.email,
        emailTemplates.applicationStatus(application.applicant.name, application.job.title, status, safeNotes)
      ).catch(() => {});
    }

    res.json({ success: true, message: `Application ${status} successfully.`, data: { application } });
  } catch (error) {
    next(error);
  }
};

// GET /api/applications/:id/download-cv
exports.downloadCV = async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'job', include: [{ model: Company, as: 'company' }] }]
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || application.job.company_id !== company.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    // SECURITY: Prevent path traversal — validate filename strictly
    const filename = application.cv_file_path;
    if (!filename || /[\/\\]/.test(filename) || filename.includes('..') || !filename.endsWith('.pdf')) {
      return res.status(400).json({ success: false, message: 'Invalid file reference.' });
    }

    const uploadDir = path.resolve(__dirname, '../uploads/cvs');
    const cvPath = path.resolve(uploadDir, filename);

    // Ensure resolved path stays inside uploads directory
    if (!cvPath.startsWith(uploadDir)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (!fs.existsSync(cvPath)) {
      return res.status(404).json({ success: false, message: 'CV file not found.' });
    }

    res.download(cvPath, `CV-Application-${application.id}.pdf`);
  } catch (error) {
    next(error);
  }
};
