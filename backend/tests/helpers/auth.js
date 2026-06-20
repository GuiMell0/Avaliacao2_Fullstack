const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/sql/User');
const { signToken } = require('../../src/controllers/authController');

async function createUser(overrides = {}) {
  const user = await User.create({
    nome: overrides.nome || 'Usuário Teste',
    email: overrides.email || `user${Date.now()}${Math.floor(Math.random() * 9999)}@email.com`,
    senhaHash: overrides.senha || 'Senha@123456',
    role: overrides.role || 'user',
  });

  return user;
}

async function createAuthUser(overrides = {}) {
  const user = await createUser(overrides);
  return {
    user,
    token: signToken(user),
    authHeader: `Bearer ${signToken(user)}`,
  };
}

async function login(email, senha) {
  const response = await request(app).post('/api/auth/login').send({ email, senha });
  return response.body.token;
}

module.exports = { createUser, createAuthUser, login };
