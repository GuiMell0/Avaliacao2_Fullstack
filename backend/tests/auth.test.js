const request = require('supertest');
const app = require('../src/app');
const { createUser } = require('./helpers/auth');

describe('Autenticação', () => {
  it('deve cadastrar usuário comum e retornar JWT', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ nome: 'Guilherme Teste', email: 'guilherme@email.com', senha: 'Senha@123456' })
      .expect(201);

    expect(response.body.token).toBeDefined();
    expect(response.body.usuario.email).toBe('guilherme@email.com');
    expect(response.body.usuario.senhaHash).toBeUndefined();
  });

  it('deve fazer login com credenciais válidas', async () => {
    await createUser({ email: 'login@email.com', senha: 'Senha@123456' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@email.com', senha: 'Senha@123456' })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  it('deve negar login inválido', async () => {
    await createUser({ email: 'erro@email.com', senha: 'Senha@123456' });

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'erro@email.com', senha: 'senhaerrada' })
      .expect(401);
  });

  it('deve proteger rota /api/auth/me', async () => {
    await request(app).get('/api/auth/me').expect(401);
  });
});
