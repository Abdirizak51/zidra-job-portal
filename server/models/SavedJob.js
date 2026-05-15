const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SavedJob = sequelize.define('SavedJob', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'jobs', key: 'id' }
    }
  }, {
    tableName: 'saved_jobs',
    timestamps: true,
    createdAt: 'saved_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'job_id']
      }
    ]
  });

  return SavedJob;
};
