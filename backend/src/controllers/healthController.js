const mongoose = require('mongoose');
const { sequelize } = require('../config/postgres');
const { asyncHandler } = require('../utils/asyncHandler');

const health = asyncHandler(async (_req, res) => {
  const postgresOk = await sequelize.authenticate().then(() => true).catch(() => false);
  const mongoOk = mongoose.connection.readyState === 1;

  return res.json({
    status: 'ok',
    service: 'Avaliação2 Fullstack API',
    bancos: {
      postgres: postgresOk ? 'conectado' : 'desconectado',
      mongo: mongoOk ? 'conectado' : 'desconectado',
    },
  });
});

module.exports = { health };
