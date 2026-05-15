const { Job, Company, User, Application, SavedJob, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/jobs - Public: list approved jobs with search & filter
exports.getJobs = async (req, res, next) => {
  try {
    const {
      search, location, job_type, category, experience_level,
      page = 1, limit = 10, sort = 'created_at', order = 'DESC'
    } = req.query;

    const where = { status: 'approved' };
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (job_type) where.job_type = job_type;
    if (category) where.category = { [Op.iLike]: `%${category}%` };
    if (experience_level) where.experience_level = experience_level;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const validSortFields = ['created_at', 'title', 'views', 'salary_min'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'company_name', 'location', 'logo_url', 'industry']
      }],
      limit: parseInt(limit),
      offset,
      order: [[sortField, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']]
    });

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/jobs/:id - Public: get job details
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'company_name', 'location', 'logo_url', 'industry', 'website', 'description', 'company_size']
      }]
    });

    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.status !== 'approved' && req.user?.role === 'applicant') {
      return res.status(403).json({ success: false, message: 'Job not available.' });
    }

    // Increment views
    await job.increment('views');

    res.json({ success: true, data: { job } });
  } catch (error) {
    next(error);
  }
};

// POST /api/jobs - Employer: create job
exports.createJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) {
      return res.status(400).json({ success: false, message: 'Create a company profile first.' });
    }

    const job = await Job.create({
      ...req.body,
      company_id: company.id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully! Awaiting admin approval.',
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/jobs/:id - Employer: update job
exports.updateJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

    const job = await Job.findOne({ where: { id: req.params.id, company_id: company.id } });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const { status, ...updateData } = req.body; // Employer can't change status
    await job.update({ ...updateData, status: 'pending' }); // Reset to pending on edit

    res.json({ success: true, message: 'Job updated successfully.', data: { job } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jobs/:id - Employer: delete job
exports.deleteJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

    const job = await Job.findOne({ where: { id: req.params.id, company_id: company.id } });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    await job.destroy();
    res.json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/jobs/employer/my-jobs - Employer: get own jobs
exports.getMyJobs = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) return res.json({ success: true, data: { jobs: [] } });

    const jobs = await Job.findAll({
      where: { company_id: company.id },
      include: [{
        model: Application,
        as: 'applications',
        attributes: ['id', 'status']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: { jobs } });
  } catch (error) {
    next(error);
  }
};

// GET /api/jobs/:id/applicants - Employer: view applicants for a job
exports.getJobApplicants = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

    const job = await Job.findOne({ where: { id: req.params.id, company_id: company.id } });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const applications = await Application.findAll({
      where: { job_id: req.params.id },
      include: [{
        model: User,
        as: 'applicant',
        attributes: ['id', 'name', 'email', 'phone', 'location', 'bio', 'skills', 'avatar_url']
      }],
      order: [['applied_at', 'DESC']]
    });

    res.json({ success: true, data: { job, applications } });
  } catch (error) {
    next(error);
  }
};
