const request = require('supertest');
const app = require('../src/app');
const { createAuthUser } = require('./helpers/auth');

const payload = {
  nome: 'Carro principal',
  marca: 'Honda',
  modelo: 'Civic',
  ano: 2020,
  placa: 'ABC1D23',
  cor: 'preto',
  valorEstimado: 95000,
};

describe('CRUD de carros - MongoDB', () => {
  it('deve exigir autenticação', async () => {
    await request(app).get('/api/carros').expect(401);
  });

  it('deve criar, listar, buscar, atualizar e remover carro', async () => {
    const { authHeader } = await createAuthUser();

    const created = await request(app)
      .post('/api/carros')
      .set('Authorization', authHeader)
      .send(payload)
      .expect(201);

    expect(created.body._id).toBeDefined();
    expect(created.body.usuarioId).toBeDefined();

    const list = await request(app)
      .get('/api/carros')
      .set('Authorization', authHeader)
      .expect(200);
    expect(list.body).toHaveLength(1);

    await request(app)
      .get(`/api/carros/${created.body._id}`)
      .set('Authorization', authHeader)
      .expect(200);

    const updated = await request(app)
      .put(`/api/carros/${created.body._id}`)
      .set('Authorization', authHeader)
      .send({ valorEstimado: 100000 })
      .expect(200);
    expect(updated.body.valorEstimado).toBe(100000);

    await request(app)
      .delete(`/api/carros/${created.body._id}`)
      .set('Authorization', authHeader)
      .expect(204);
  });

  it('deve validar campos obrigatórios do carro', async () => {
    const { authHeader } = await createAuthUser();

    await request(app)
      .post('/api/carros')
      .set('Authorization', authHeader)
      .send({ marca: 'Honda' })
      .expect(400);
  });
});
