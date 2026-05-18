const { Sequelize } = require('sequelize');

// ============================================================
// DATABASE CONNECTION
// Supports both: DATABASE_URL (Render/Railway) and individual
// env vars (local development)
// ============================================================
let sequelize;

if (process.env.DATABASE_URL) {
  // Production (Render, Railway, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  });
} else {
  // Local development
  sequelize = new Sequelize(
    process.env.DB_NAME || 'zidra_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres123',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
    }
  );
}

// Import models
const User = require('./User')(sequelize);
const Company = require('./Company')(sequelize);
const Job = require('./Job')(sequelize);
const Application = require('./Application')(sequelize);
const SavedJob = require('./SavedJob')(sequelize);

// ── Associations ──────────────────────────────────────────────
User.hasOne(Company,      { foreignKey: 'owner_id', as: 'company'     });
User.hasMany(Application, { foreignKey: 'user_id',  as: 'applications' });
User.hasMany(SavedJob,    { foreignKey: 'user_id',  as: 'savedJobs'   });

Company.belongsTo(User,   { foreignKey: 'owner_id',  as: 'owner' });
Company.hasMany(Job,      { foreignKey: 'company_id', as: 'jobs'  });

Job.belongsTo(Company,    { foreignKey: 'company_id', as: 'company'      });
Job.hasMany(Application,  { foreignKey: 'job_id',     as: 'applications' });
Job.hasMany(SavedJob,     { foreignKey: 'job_id',     as: 'savedByUsers' });

Application.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });
Application.belongsTo(Job,  { foreignKey: 'job_id',  as: 'job'       });

SavedJob.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
SavedJob.belongsTo(Job,  { foreignKey: 'job_id',  as: 'job'  });

module.exports = { sequelize, Sequelize, User, Company, Job, Application, SavedJob };
