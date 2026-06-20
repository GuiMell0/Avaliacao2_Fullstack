const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET || 'J94ZqUMrUJTvjBYzMSclu4VDaUIRtrZwgcfcjYQdzQS',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/avaliacao2_fullstack_nosql',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    name: process.env.DB_NAME || 'avaliacao2_fullstack',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  defaultAdmin: {
    nome: process.env.DEFAULT_ADMIN_NAME || 'Administrador',
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@bens.com',
    senha: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123456',
  },
};

module.exports = { env };
