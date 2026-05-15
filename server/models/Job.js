const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Job = sequelize.define('Job', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { len: [3, 200] }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    salary_min: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    salary_max: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    salary_currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD'
    },
    job_type: {
      type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote'),
      allowNull: false,
      defaultValue: 'full-time'
    },
    experience_level: {
      type: DataTypes.ENUM('entry', 'mid', 'senior', 'executive'),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'closed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'companies', key: 'id' }
    }
  }, {
    tableName: 'jobs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Job;
};
