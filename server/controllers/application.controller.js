const path = require('path');
const fs = require('fs');
const { Application, Job, Company, User } = require('../models');
const { sendEmail, emailTemplates } = require('../middlewares/email.service');

// POST /api/applications/:jobId/apply - Applicant: apply for a job
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
      fs.unlinkSync(req.file.path); // Clean up uploaded file
      return res.status(404).json({ success: false, message: 'Job not found or not available.' });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      where: { job_id: req.params.jobId, user_id: req.user.id }
    });

    if (existingApp) {
      fs.unlinkSync(req.file.path);
      return res.status(409).json({ success: false, message: 'You have already applied for this job.' });
    }

    const application = await Application.create({
      job_id: req.params.jobId,
      user_id: req.user.id,
      cv_file_path: req.file.filename,
      cover_letter: req.body.cover_letter || null,
      status: 'pending'
    });

    // Send confirmation email (non-blocking)
    sendEmail(
      req.user.email,
      emailTemplates.applicationConfirmation(req.user.name, job.title, job.company.company_name)
    ).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: { application }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// GET /api/applications/my - Applicant: get my applications
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

// PATCH /api/applications/:id/status - Employer: update application status
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

    // Verify ownership
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || application.job.company_id !== company.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await application.update({ status, employer_notes: employer_notes || null });

    // Send email notification for accepted/rejected
    if (status === 'accepted' || status === 'rejected') {
      sendEmail(
        application.applicant.email,
        emailTemplates.applicationStatus(
          application.applicant.name,
          application.job.title,
          status,
          employer_notes
        )
      ).catch(console.error);
    }

    res.json({ success: true, message: `Application ${status} successfully.`, data: { application } });
  } catch (error) {
    next(error);
  }
};

// GET /api/applications/:id/download-cv - Employer: download CV
exports.downloadCV = async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'job', include: [{ model: Company, as: 'company' }] }]
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Verify employer owns the job
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company || application.job.company_id !== company.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const cvPath = path.join(__dirname, '../uploads/cvs', application.cv_file_path);
    if (!fs.existsSync(cvPath)) {
      return res.status(404).json({ success: false, message: 'CV file not found.' });
    }

    res.download(cvPath, `CV-Application-${application.id}.pdf`);
  } catch (error) {
    next(error);
  }
};
