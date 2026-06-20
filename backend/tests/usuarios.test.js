const request = require('supertest');
const app = require('../src/app');
const { createAuthUser, createUser } = require('./helpers/auth');

describe('CRUD de usuários - PostgreSQL', () => {
  it('deve permitir admin criar, listar, buscar, atualizar e remover usuário', async () => {
    const { authHeader } = await createAuthUser({ role: 'admin', email: 'admin@email.com' });

    const created = await request(app)
      .post('/api/usuarios')
      .set('Authorization', authHeader)
      .send({ nome: 'Novo Usuário', email: 'novo@email.com', senha: 'Senha@123456', role: 'user' })
      .expect(201);

    expect(created.body.id).toBeDefined();

    const list = await request(app)
      .get('/api/usuarios')
      .set('Authorization', authHeader)
      .expect(200);
    expect(list.body.length).toBeGreaterThanOrEqual(2);

    await request(app)
      .get(`/api/usuarios/${created.body.id}`)
      .set('Authorization', authHeader)
      .expect(200);

    const updated = await request(app)
      .put(`/api/usuarios/${created.body.id}`)
      .set('Authorization', authHeader)
      .send({ nome: 'Usuário Atualizado' })
      .expect(200);
    expect(updated.body.nome).toBe('Usuário Atualizado');

    await request(app)
      .delete(`/api/usuarios/${created.body.id}`)
      .set('Authorization', authHeader)
      .expect(204);
  });

  it('deve bloquear usuário comum ao listar usuários', async () => {
    const { authHeader } = await createAuthUser({ role: 'user' });

    await request(app)
      .get('/api/usuarios')
      .set('Authorization', authHeader)
      .expect(403);
  });

  it('deve permitir usuário comum acessar os próprios dados', async () => {
    const { user, authHeader } = await createAuthUser({ role: 'user' });

    const response = await request(app)
      .get(`/api/usuarios/${user.id}`)
      .set('Authorization', authHeader)
      .expect(200);

    expect(response.body.id).toBe(user.id);
  });

  it('deve impedir usuário comum acessar dados de outro usuário', async () => {
    const { authHeader } = await createAuthUser({ role: 'user', email: 'u1@email.com' });
    const other = await createUser({ email: 'u2@email.com' });

    await request(app)
      .get(`/api/usuarios/${other.id}`)
      .set('Authorization', authHeader)
      .expect(403);
  });
});
