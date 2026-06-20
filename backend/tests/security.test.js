const request = require('supertest');
const app = require('../src/app');
const { createAuthUser } = require('./helpers/auth');

describe('Segurança e validações', () => {
  it('deve desabilitar header x-powered-by', async () => {
    const response = await request(app).get('/api/health');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('deve negar token inválido', async () => {
    await request(app)
      .get('/api/carros')
      .set('Authorization', 'Bearer token_invalido')
      .expect(401);
  });

  it('deve sanitizar chaves maliciosas de NoSQL injection', async () => {
    const { authHeader } = await createAuthUser();

    await request(app)
      .post('/api/carros')
      .set('Authorization', authHeader)
      .send({
        nome: 'Carro seguro',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2021,
        '$where': 'this.valorEstimado > 0',
      })
      .expect(201);
  });
});
