const { Sequelize } = require('sequelize');

// Database configuration - supports PostgreSQL, SQL Server, and SQLite
const dbType = process.env.DB_TYPE || 'sqlite';
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (dbType === 'postgresql' || (isProduction && process.env.DATABASE_URL)) {
  // PostgreSQL configuration (recommended for production)
  const databaseUrl = process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'car_enthusiasts'}`;
  
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: isProduction ? { rejectUnauthorized: false } : false
    }
  });
} else if (dbType === 'mssql' || process.env.USE_SQL_SERVER === 'true') {
  // SQL Server configuration
  sequelize = new Sequelize({
    database: process.env.DB_NAME || 'CarEnthusiastsDB',
    username: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'YourPassword123!',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: false, // Set to true if using Azure SQL
        trustServerCertificate: true, // Set to true for local development
        enableArithAbort: true
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false // Set to console.log for SQL queries
  });
} else {
  // SQLite configuration (fallback for development)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

module.exports = sequelize;
