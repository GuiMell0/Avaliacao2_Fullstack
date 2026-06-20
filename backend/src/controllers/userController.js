const User = require('../models/sql/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../utils/httpError');

const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.findAll({ order: [['id', 'ASC']] });
  return res.json(users);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw httpError(404, 'Usuário não encontrado.');
  return res.json(user);
});

const createUser = asyncHandler(async (req, res) => {
  const user = await User.create({
    nome: req.body.nome,
    email: req.body.email,
    senhaHash: req.body.senha,
    role: req.body.role || 'user',
  });

  return res.status(201).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw httpError(404, 'Usuário não encontrado.');

  if (req.user.role !== 'admin' && req.body.role) {
    throw httpError(403, 'Usuário comum não pode alterar perfil de acesso.');
  }

  await user.update({
    nome: req.body.nome ?? user.nome,
    email: req.body.email ?? user.email,
    senhaHash: req.body.senha ?? user.senhaHash,
    role: req.body.role ?? user.role,
  });

  return res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw httpError(404, 'Usuário não encontrado.');

  if (req.user.id === user.id) {
    throw httpError(400, 'Administrador não pode remover a si mesmo por esta rota.');
  }

  await user.destroy();
  return res.status(204).send();
});

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
