const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Avaliação2 Fullstack — Gerenciamento de Bens Pessoais API',
    version: '1.0.0',
    description: 'API REST com Node.js, Express, PostgreSQL, MongoDB, JWT, Swagger, Docker e testes de integração.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Ambiente Docker local' },
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Usuários' },
    { name: 'Carros' },
    { name: 'Motos' },
    { name: 'Marcas de roupa' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Login: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', example: 'admin@bens.com' },
          senha: { type: 'string', example: 'Admin@123456' },
        },
      },
      Register: {
        type: 'object',
        required: ['nome', 'email', 'senha'],
        properties: {
          nome: { type: 'string', example: 'Guilherme Mello' },
          email: { type: 'string', example: 'guilherme@email.com' },
          senha: { type: 'string', example: 'Senha@123456' },
        },
      },
      UserCreate: {
        type: 'object',
        required: ['nome', 'email', 'senha'],
        properties: {
          nome: { type: 'string', example: 'Usuário Teste' },
          email: { type: 'string', example: 'teste@email.com' },
          senha: { type: 'string', example: 'Senha@123456' },
          role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
        },
      },
      Car: {
        type: 'object',
        required: ['nome', 'marca', 'modelo', 'ano'],
        properties: {
          nome: { type: 'string', example: 'Meu carro' },
          marca: { type: 'string', example: 'Honda' },
          modelo: { type: 'string', example: 'Civic' },
          ano: { type: 'number', example: 2020 },
          placa: { type: 'string', example: 'ABC1D23' },
          cor: { type: 'string', example: 'preto' },
          valorEstimado: { type: 'number', example: 95000 },
          observacoes: { type: 'string', example: 'Revisado recentemente' },
        },
      },
      Motorcycle: {
        type: 'object',
        required: ['nome', 'marca', 'modelo', 'ano'],
        properties: {
          nome: { type: 'string', example: 'Minha moto' },
          marca: { type: 'string', example: 'Yamaha' },
          modelo: { type: 'string', example: 'Fazer' },
          ano: { type: 'number', example: 2022 },
          cilindradas: { type: 'number', example: 250 },
          placa: { type: 'string', example: 'XYZ1A23' },
          cor: { type: 'string', example: 'azul' },
          valorEstimado: { type: 'number', example: 22000 },
          observacoes: { type: 'string', example: 'Usada para deslocamento diário' },
        },
      },
      ClothingBrand: {
        type: 'object',
        required: ['nome', 'marca', 'tipo'],
        properties: {
          nome: { type: 'string', example: 'Jaqueta favorita' },
          marca: { type: 'string', example: 'Nike' },
          tipo: { type: 'string', example: 'jaqueta' },
          tamanho: { type: 'string', example: 'M' },
          cor: { type: 'string', example: 'preta' },
          quantidade: { type: 'number', example: 1 },
          valorEstimado: { type: 'number', example: 350 },
          observacoes: { type: 'string', example: 'Item de maior valor no guarda-roupa' },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica status da API e bancos',
        responses: { 200: { description: 'API disponível' } },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Cadastra usuário comum',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Register' } } } },
        responses: { 201: { description: 'Usuário cadastrado' }, 400: { description: 'Dados inválidos' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Realiza login',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } },
        responses: { 200: { description: 'Login realizado' }, 401: { description: 'Credenciais inválidas' } },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Retorna usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Usuário autenticado' }, 401: { description: 'Token ausente ou inválido' } },
      },
    },
    '/api/usuarios': {
      get: {
        tags: ['Usuários'],
        summary: 'Lista usuários',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Lista de usuários' }, 403: { description: 'Acesso negado' } },
      },
      post: {
        tags: ['Usuários'],
        summary: 'Cria usuário como administrador',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserCreate' } } } },
        responses: { 201: { description: 'Usuário criado' }, 403: { description: 'Acesso negado' } },
      },
    },
    '/api/usuarios/{id}': {
      get: {
        tags: ['Usuários'],
        summary: 'Busca usuário por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Usuário encontrado' }, 404: { description: 'Não encontrado' } },
      },
      put: {
        tags: ['Usuários'],
        summary: 'Atualiza usuário',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserCreate' } } } },
        responses: { 200: { description: 'Usuário atualizado' }, 404: { description: 'Não encontrado' } },
      },
      delete: {
        tags: ['Usuários'],
        summary: 'Remove usuário',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Usuário removido' }, 403: { description: 'Acesso negado' } },
      },
    },
    '/api/carros': createCrudPath('Carros', '#/components/schemas/Car'),
    '/api/carros/{id}': createCrudPathById('Carros', '#/components/schemas/Car'),
    '/api/motos': createCrudPath('Motos', '#/components/schemas/Motorcycle'),
    '/api/motos/{id}': createCrudPathById('Motos', '#/components/schemas/Motorcycle'),
    '/api/marcas-roupa': createCrudPath('Marcas de roupa', '#/components/schemas/ClothingBrand'),
    '/api/marcas-roupa/{id}': createCrudPathById('Marcas de roupa', '#/components/schemas/ClothingBrand'),
  },
};

function createCrudPath(tag, schemaRef) {
  return {
    get: {
      tags: [tag],
      summary: `Lista ${tag.toLowerCase()}`,
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Lista retornada' }, 401: { description: 'Token ausente ou inválido' } },
    },
    post: {
      tags: [tag],
      summary: `Cria item em ${tag.toLowerCase()}`,
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: schemaRef } } } },
      responses: { 201: { description: 'Item criado' }, 400: { description: 'Dados inválidos' } },
    },
  };
}

function createCrudPathById(tag, schemaRef) {
  return {
    get: {
      tags: [tag],
      summary: `Busca item de ${tag.toLowerCase()} por ID`,
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Item encontrado' }, 404: { description: 'Não encontrado' } },
    },
    put: {
      tags: [tag],
      summary: `Atualiza item de ${tag.toLowerCase()}`,
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: schemaRef } } } },
      responses: { 200: { description: 'Item atualizado' }, 404: { description: 'Não encontrado' } },
    },
    delete: {
      tags: [tag],
      summary: `Remove item de ${tag.toLowerCase()}`,
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 204: { description: 'Item removido' }, 404: { description: 'Não encontrado' } },
    },
  };
}

module.exports = swaggerSpec;
