const { User, Company, Job, Application, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/admin/stats - Dashboard analytics
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, totalApplications, pendingJobs, totalCompanies] = await Promise.all([
      User.count({ where: { role: { [Op.ne]: 'admin' } } }),
      Job.count(),
      Application.count(),
      Job.count({ where: { status: 'pending' } }),
      Company.count()
    ]);

    const recentUsers = await User.findAll({
      where: { role: { [Op.ne]: 'admin' } },
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'email', 'role', 'is_active', 'created_at']
    });

    const recentJobs = await Job.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [{ model: Company, as: 'company', attributes: ['company_name'] }]
    });

    const jobsByStatus = await Job.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true
    });

    const applicationsByStatus = await Application.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        stats: { totalUsers, totalJobs, totalApplications, pendingJobs, totalCompanies },
        recentUsers,
        recentJobs,
        jobsByStatus,
        applicationsByStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users - Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const where = { role: { [Op.ne]: 'admin' } };

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) where.role = role;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: users } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: { users, pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) } }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/toggle-status - Block/unblock user
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot modify admin.' });

    await user.update({ is_active: !user.is_active });
    res.json({
      success: true,
      message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully.`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id - Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin.' });

    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/jobs - Get all jobs (including pending)
exports.getJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [{ model: Company, as: 'company', attributes: ['company_name', 'owner_id'] }],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: { jobs, pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) } }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/jobs/:id/status - Approve or reject job
exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    await job.update({ status });
    res.json({ success: true, message: `Job ${status} successfully.`, data: { job } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/jobs/:id - Delete job
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    await job.destroy();
    res.json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
