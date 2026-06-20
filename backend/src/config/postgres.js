const { Sequelize } = require('sequelize');
const { env } = require('./env');

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect,
  logging: env.nodeEnv === 'development' ? false : false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

async function connectPostgres() {
  await sequelize.authenticate();
  await sequelize.sync();
  return sequelize;
}

module.exports = { sequelize, connectPostgres };
