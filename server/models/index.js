const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'zidra_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('./User')(sequelize);
const Company = require('./Company')(sequelize);
const Job = require('./Job')(sequelize);
const Application = require('./Application')(sequelize);
const SavedJob = require('./SavedJob')(sequelize);

// Define associations
// User associations
User.hasOne(Company, { foreignKey: 'owner_id', as: 'company' });
User.hasMany(Application, { foreignKey: 'user_id', as: 'applications' });
User.hasMany(SavedJob, { foreignKey: 'user_id', as: 'savedJobs' });

// Company associations
Company.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Company.hasMany(Job, { foreignKey: 'company_id', as: 'jobs' });

// Job associations
Job.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });
Job.hasMany(SavedJob, { foreignKey: 'job_id', as: 'savedByUsers' });

// Application associations
Application.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

// SavedJob associations
SavedJob.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
SavedJob.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Company,
  Job,
  Application,
  SavedJob
};
