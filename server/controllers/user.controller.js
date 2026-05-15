const { User } = require('../models');

// GET /api/users/profile - Get own profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile - Update own profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, bio, skills } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());

    await User.update(updateData, { where: { id: req.user.id } });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ success: true, message: 'Profile updated successfully!', data: { user: updatedUser } });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/upload-cv - Upload CV
exports.uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    await User.update({ cv_path: req.file.filename }, { where: { id: req.user.id } });

    res.json({
      success: true,
      message: 'CV uploaded successfully!',
      data: { cv_path: req.file.filename }
    });
  } catch (error) {
    next(error);
  }
};
