const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Application = sequelize.define('Application', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'jobs', key: 'id' }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    cv_file_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cover_letter: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewing', 'accepted', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    employer_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'applications',
    timestamps: true,
    createdAt: 'applied_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['job_id', 'user_id']
      }
    ]
  });

  return Application;
};
