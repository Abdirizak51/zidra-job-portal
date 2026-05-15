const { Company, Job, User } = require('../models');

// GET /api/companies/my - Get employer's company
exports.getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      where: { owner_id: req.user.id },
      include: [{ model: Job, as: 'jobs', attributes: ['id', 'title', 'status', 'created_at'] }]
    });

    res.json({ success: true, data: { company } });
  } catch (error) {
    next(error);
  }
};

// POST /api/companies - Create company profile
exports.createCompany = async (req, res, next) => {
  try {
    const existing = await Company.findOne({ where: { owner_id: req.user.id } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Company profile already exists. Use PUT to update.' });
    }

    const company = await Company.create({ ...req.body, owner_id: req.user.id });
    res.status(201).json({ success: true, message: 'Company profile created!', data: { company } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/companies/my - Update company profile
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ where: { owner_id: req.user.id } });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

    await company.update(req.body);
    res.json({ success: true, message: 'Company profile updated!', data: { company } });
  } catch (error) {
    next(error);
  }
};

// GET /api/companies/:id - Public: get company by id
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      include: [{
        model: Job,
        as: 'jobs',
        where: { status: 'approved' },
        required: false,
        attributes: ['id', 'title', 'location', 'job_type', 'created_at', 'salary_min', 'salary_max']
      }]
    });

    if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

    res.json({ success: true, data: { company } });
  } catch (error) {
    next(error);
  }
};
