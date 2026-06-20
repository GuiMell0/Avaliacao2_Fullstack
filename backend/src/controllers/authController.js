const jwt = require('jsonwebtoken');
const User = require('../models/sql/User');
const { env } = require('../config/env');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../utils/httpError');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

const register = asyncHandler(async (req, res) => {
  const user = await User.create({
    nome: req.body.nome,
    email: req.body.email,
    senhaHash: req.body.senha,
    role: 'user',
  });

  return res.status(201).json({
    mensagem: 'Usuário cadastrado com sucesso.',
    token: signToken(user),
    usuario: user,
  });
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user || !(await user.checkPassword(req.body.senha))) {
    throw httpError(401, 'E-mail ou senha inválidos.');
  }

  return res.json({
    mensagem: 'Login realizado com sucesso.',
    token: signToken(user),
    usuario: user,
  });
});

const me = asyncHandler(async (req, res) => {
  return res.json({ usuario: req.user });
});

module.exports = { register, login, me, signToken };
