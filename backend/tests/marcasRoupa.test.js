const request = require('supertest');
const app = require('../src/app');
const { createAuthUser } = require('./helpers/auth');

const payload = {
  nome: 'Jaqueta favorita',
  marca: 'Nike',
  tipo: 'jaqueta',
  tamanho: 'M',
  cor: 'preta',
  quantidade: 1,
  valorEstimado: 350,
};

describe('CRUD de marcas de roupa - MongoDB', () => {
  it('deve exigir autenticação', async () => {
    await request(app).get('/api/marcas-roupa').expect(401);
  });

  it('deve criar, listar, buscar, atualizar e remover marca/item de roupa', async () => {
    const { authHeader } = await createAuthUser();

    const created = await request(app)
      .post('/api/marcas-roupa')
      .set('Authorization', authHeader)
      .send(payload)
      .expect(201);

    const list = await request(app)
      .get('/api/marcas-roupa')
      .set('Authorization', authHeader)
      .expect(200);
    expect(list.body).toHaveLength(1);

    await request(app)
      .get(`/api/marcas-roupa/${created.body._id}`)
      .set('Authorization', authHeader)
      .expect(200);

    const updated = await request(app)
      .put(`/api/marcas-roupa/${created.body._id}`)
      .set('Authorization', authHeader)
      .send({ quantidade: 2 })
      .expect(200);
    expect(updated.body.quantidade).toBe(2);

    await request(app)
      .delete(`/api/marcas-roupa/${created.body._id}`)
      .set('Authorization', authHeader)
      .expect(204);
  });
});
