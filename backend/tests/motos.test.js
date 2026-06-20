const request = require('supertest');
const app = require('../src/app');
const { createAuthUser } = require('./helpers/auth');

const payload = {
  nome: 'Moto da faculdade',
  marca: 'Yamaha',
  modelo: 'Fazer',
  ano: 2022,
  cilindradas: 250,
  placa: 'XYZ1A23',
  cor: 'azul',
  valorEstimado: 22000,
};

describe('CRUD de motos - MongoDB', () => {
  it('deve exigir autenticação', async () => {
    await request(app).get('/api/motos').expect(401);
  });

  it('deve criar, listar, buscar, atualizar e remover moto', async () => {
    const { authHeader } = await createAuthUser();

    const created = await request(app)
      .post('/api/motos')
      .set('Authorization', authHeader)
      .send(payload)
      .expect(201);

    const list = await request(app)
      .get('/api/motos')
      .set('Authorization', authHeader)
      .expect(200);
    expect(list.body).toHaveLength(1);

    await request(app)
      .get(`/api/motos/${created.body._id}`)
      .set('Authorization', authHeader)
      .expect(200);

    const updated = await request(app)
      .put(`/api/motos/${created.body._id}`)
      .set('Authorization', authHeader)
      .send({ cor: 'preta' })
      .expect(200);
    expect(updated.body.cor).toBe('preta');

    await request(app)
      .delete(`/api/motos/${created.body._id}`)
      .set('Authorization', authHeader)
      .expect(204);
  });
});
