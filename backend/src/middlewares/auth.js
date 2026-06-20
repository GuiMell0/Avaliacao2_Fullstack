const jwt = require('jsonwebtoken');
const User = require('../models/sql/User');
const { env } = require('../config/env');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../utils/httpError');

const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    throw httpError(401, 'Token não informado.');
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findByPk(payload.id);

    if (!user) {
      throw httpError(401, 'Usuário do token não encontrado.');
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.status) throw error;
    throw httpError(401, 'Token inválido ou expirado.');
  }
});

function authorize(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(httpError(403, 'Acesso negado para este perfil.'));
    }
    return next();
  };
}

function authorizeSelfOrAdmin(paramName = 'id') {
  return (req, _res, next) => {
    const requestedId = Number(req.params[paramName]);

    if (req.user.role === 'admin' || req.user.id === requestedId) {
      return next();
    }

    return next(httpError(403, 'Você só pode acessar seus próprios dados.'));
  };
}

module.exports = { authenticate, authorize, authorizeSelfOrAdmin };
