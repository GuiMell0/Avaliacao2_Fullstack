const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');

const testBypass = (_req, _res, next) => next();

const globalLimiter = env.nodeEnv === 'test'
  ? testBypass
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { erro: 'Muitas requisições. Tente novamente em alguns minutos.' },
    });

const authLimiter = env.nodeEnv === 'test'
  ? testBypass
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: { erro: 'Muitas tentativas de autenticação. Tente novamente em alguns minutos.' },
    });

module.exports = { globalLimiter, authLimiter };
