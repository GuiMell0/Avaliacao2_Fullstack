# Avaliação Fullstack — Gerenciamento de Bens Pessoais

API e aplicação web para gerenciamento de bens pessoais, desenvolvidas para a Avaliação da disciplina Laboratório de Programação Fullstack. O projeto utiliza Node.js com Express no backend, React com Tailwind CSS no frontend, PostgreSQL para persistência relacional de usuários, MongoDB para persistência NoSQL dos bens, autenticação JWT, Swagger, testes de integração e execução padronizada com Docker Compose.


---

## Sumário

- [Visão geral](#visão-geral)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Persistência de dados](#persistência-de-dados)
- [Segurança aplicada](#segurança-aplicada)
- [Como executar com Docker](#como-executar-com-docker)
- [Usuário administrador padrão](#usuário-administrador-padrão)
- [Documentação Swagger](#documentação-swagger)
- [Rotas principais](#rotas-principais)
- [Testes de integração](#testes-de-integração)
- [Evidência dos requisitos obrigatórios](#evidência-dos-requisitos-obrigatórios)

---

## Visão geral

O sistema foi desenvolvido como uma solução fullstack para controle de bens pessoais. Após realizar cadastro ou login, o usuário recebe um token JWT e passa a acessar rotas protegidas da API. Usuários comuns conseguem gerenciar apenas seus próprios bens, enquanto o administrador possui permissões adicionais para gerenciar usuários.

Funcionalidades principais:

- cadastro e login de usuários;
- autenticação com JWT;
- painel web para gerenciamento de bens;
- CRUD de usuários em PostgreSQL;
- CRUD de carros em MongoDB;
- CRUD de motos em MongoDB;
- CRUD de marcas/itens de roupa em MongoDB;
- proteção de rotas privadas;
- autorização por perfil de acesso;
- documentação Swagger;
- testes automatizados com Jest e Supertest;
- execução completa via Docker Compose.

---

## Tecnologias utilizadas

| Tecnologia | Aplicação no projeto |
|---|---|
| Node.js | Ambiente de execução da API |
| Express | Criação das rotas REST e middlewares |
| PostgreSQL | Banco SQL relacional para usuários |
| Sequelize | ORM usado para modelar e acessar usuários no PostgreSQL |
| MongoDB | Banco NoSQL para carros, motos e marcas/itens de roupa |
| Mongoose | ODM usado para modelar os documentos NoSQL |
| JWT | Autenticação baseada em token |
| BcryptJS | Hash seguro das senhas |
| Joi | Validação dos dados de entrada |
| Helmet | Proteção de cabeçalhos HTTP |
| CORS | Controle das origens permitidas |
| Express Rate Limit | Limitação de requisições para reduzir abuso |
| Morgan | Logs HTTP da API |
| Swagger UI Express | Documentação automática da API |
| Jest | Execução dos testes automatizados |
| Supertest | Testes de integração das rotas HTTP |
| React | Interface web da aplicação |
| Tailwind CSS | Estilização responsiva do frontend |
| Vite | Build e estrutura do frontend React |
| Docker | Conteinerização dos serviços |
| Docker Compose | Orquestração do backend, frontend e bancos |

---

## Arquitetura do projeto

```txt
Avaliação2_Fullstack/
├── backend/
│   ├── src/
│   │   ├── config/          # Variáveis de ambiente e conexões com bancos
│   │   ├── controllers/     # Fluxo das requisições e respostas
│   │   ├── docs/            # Configuração do Swagger
│   │   ├── middlewares/     # Autenticação, autorização, validação e segurança
│   │   ├── models/          # Models SQL e NoSQL
│   │   ├── routes/          # Rotas REST da API
│   │   ├── utils/           # Funções auxiliares
│   │   └── validators/      # Schemas de validação Joi
│   ├── tests/               # Testes de integração com Jest e Supertest
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Cliente HTTP para comunicação com a API
│   │   ├── components/      # Componentes visuais reutilizáveis
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docs/
│   ├── COMO_TESTAR.md
│   └── EVIDENCIAS_REQUISITOS.md
├── docker-compose.yml
├── .env.example
└── README.md
```

A organização separa responsabilidades para facilitar manutenção e avaliação. O backend concentra as regras de API, autenticação, autorização, validação, conexão com bancos e documentação. O frontend consome as rotas da API e oferece uma experiência visual para cadastro, login e operações de CRUD. A infraestrutura fica centralizada no Docker Compose, garantindo que o projeto seja executado de forma padronizada.

---

## Persistência de dados

### Banco SQL relacional — PostgreSQL

O PostgreSQL foi utilizado para o recurso de usuários, pois esse tipo de dado possui estrutura fixa e exige controle mais rígido de integridade. A tabela de usuários armazena nome, e-mail, senha criptografada e perfil de acesso.

Recurso implementado em SQL:

- usuários.

Arquivos principais:

- `backend/src/models/sql/User.js`;
- `backend/src/controllers/userController.js`;
- `backend/src/routes/userRoutes.js`.

### Banco NoSQL — MongoDB

O MongoDB foi utilizado para os bens pessoais, pois carros, motos e marcas/itens de roupa são documentos que podem variar e evoluir com novos campos. Essa escolha atende ao requisito de persistência NoSQL para os recursos solicitados.

Recursos implementados em NoSQL:

- carros;
- motos;
- marcas/itens de roupa.

Arquivos principais:

- `backend/src/models/nosql/Car.js`;
- `backend/src/models/nosql/Motorcycle.js`;
- `backend/src/models/nosql/ClothingBrand.js`;
- `backend/src/controllers/createAssetController.js`.

---

## Segurança aplicada

A aplicação implementa mecanismos ligados a boas práticas de segurança e à OWASP Top 10:

- autenticação com JWT;
- rotas privadas protegidas por Bearer Token;
- autorização por perfil `admin` e `user`;
- usuário comum acessa apenas seus próprios bens;
- senhas protegidas com BcryptJS;
- senha nunca é retornada nas respostas da API;
- validação de entrada com Joi;
- sanitização de payloads para reduzir risco de NoSQL Injection;
- proteção de cabeçalhos HTTP com Helmet;
- remoção do cabeçalho `x-powered-by`;
- configuração de CORS por variável de ambiente;
- rate limit para reduzir abuso de requisições;
- tratamento centralizado de erros;
- separação de credenciais e configurações por variáveis de ambiente.

Arquivos principais:

- `backend/src/middlewares/auth.js`;
- `backend/src/middlewares/validate.js`;
- `backend/src/middlewares/sanitizeInput.js`;
- `backend/src/middlewares/rateLimit.js`;
- `backend/src/middlewares/errorHandler.js`.

---

## Como executar com Docker

### Pré-requisitos

- Docker instalado;
- Docker Compose disponível.

### 1. Entrar na pasta do projeto

```bash
cd Avaliação2_Fullstack
```

### 2. Subir todos os serviços

```bash
docker compose up --build
```

Esse comando executa:

- backend Node.js/Express;
- frontend React servido com Nginx;
- PostgreSQL;
- MongoDB.

### 3. Acessar a aplicação

```txt
Frontend: http://localhost:8080
API: http://localhost:3000
Swagger: http://localhost:3000/api-docs
Health check: http://localhost:3000/api/health
```

### 4. Encerrar a aplicação

```bash
docker compose down
```

### 5. Encerrar e apagar os volumes dos bancos

```bash
docker compose down -v
```


---

## Usuário administrador padrão

Ao iniciar a API, o sistema cria automaticamente um administrador padrão caso ele ainda não exista.

```txt
E-mail: admin@bens.com
Senha: Admin@123456
```

Esse usuário pode ser utilizado para testar permissões administrativas, como listagem, criação e remoção de usuários.

---

## Documentação Swagger

A documentação automática da API fica disponível em:

```txt
http://localhost:3000/api-docs
```

No Swagger é possível visualizar as rotas, modelos de dados, exemplos de payloads, respostas esperadas e rotas protegidas por autenticação Bearer Token.

Arquivo responsável:

- `backend/src/docs/swagger.js`.

---

## Rotas principais

### Saúde da API

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| GET | `/api/health` | Não | Verifica status da API e conexão com os bancos |

### Autenticação

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | Não | Cadastra usuário comum |
| POST | `/api/auth/login` | Não | Realiza login e retorna JWT |
| GET | `/api/auth/me` | Sim | Retorna dados do usuário autenticado |

### Usuários — PostgreSQL

| Método | Rota | Protegida | Permissão | Descrição |
|---|---|---|---|---|
| GET | `/api/usuarios` | Sim | admin | Lista usuários |
| GET | `/api/usuarios/:id` | Sim | dono ou admin | Busca usuário por ID |
| POST | `/api/usuarios` | Sim | admin | Cria usuário |
| PUT | `/api/usuarios/:id` | Sim | dono ou admin | Atualiza usuário |
| DELETE | `/api/usuarios/:id` | Sim | admin | Remove usuário |

### Carros — MongoDB

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| GET | `/api/carros` | Sim | Lista carros do usuário autenticado |
| GET | `/api/carros/:id` | Sim | Busca carro por ID |
| POST | `/api/carros` | Sim | Cria carro |
| PUT | `/api/carros/:id` | Sim | Atualiza carro |
| DELETE | `/api/carros/:id` | Sim | Remove carro |

### Motos — MongoDB

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| GET | `/api/motos` | Sim | Lista motos do usuário autenticado |
| GET | `/api/motos/:id` | Sim | Busca moto por ID |
| POST | `/api/motos` | Sim | Cria moto |
| PUT | `/api/motos/:id` | Sim | Atualiza moto |
| DELETE | `/api/motos/:id` | Sim | Remove moto |

### Marcas/itens de roupa — MongoDB

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| GET | `/api/marcas-roupa` | Sim | Lista marcas/itens de roupa do usuário autenticado |
| GET | `/api/marcas-roupa/:id` | Sim | Busca marca/item por ID |
| POST | `/api/marcas-roupa` | Sim | Cria marca/item |
| PUT | `/api/marcas-roupa/:id` | Sim | Atualiza marca/item |
| DELETE | `/api/marcas-roupa/:id` | Sim | Remove marca/item |

---

## Testes de integração

Os testes foram implementados com Jest e Supertest e cobrem os fluxos principais da API.

Arquivos de teste:

- `backend/tests/auth.test.js`;
- `backend/tests/usuarios.test.js`;
- `backend/tests/carros.test.js`;
- `backend/tests/motos.test.js`;
- `backend/tests/marcasRoupa.test.js`;
- `backend/tests/security.test.js`.

Para executar os testes via Docker:

```bash
docker compose --profile test run --rm api-test
```

O profile de testes utiliza bancos separados:

- `postgres-test`;
- `mongo-test`.

Dessa forma, os testes não interferem nos dados usados na execução principal do sistema.

---

## Evidência dos requisitos obrigatórios

| Requisito solicitado | Como foi cumprido no projeto |
|---|---|
| Utilizar Node.js com Express | API criada em `backend/src/app.js` e inicializada por `backend/src/server.js`. |
| Utilizar variáveis de ambiente com `.env` | Arquivos `.env.example` na raiz e em `backend/`, com leitura centralizada em `backend/src/config/env.js`. |
| Implementar autenticação com JWT | `backend/src/controllers/authController.js` gera JWT no cadastro e no login. |
| Criar rotas protegidas | Rotas privadas usam `authenticate` em `backend/src/middlewares/auth.js`. |
| Aplicar autenticação e autorização | Perfis `admin` e `user`, com `authorize` e `authorizeSelfOrAdmin`. |
| CRUD de carro em NoSQL | Model `Car.js`, rotas `/api/carros` e testes `carros.test.js`. |
| CRUD de moto em NoSQL | Model `Motorcycle.js`, rotas `/api/motos` e testes `motos.test.js`. |
| CRUD de marca de roupa em NoSQL | Model `ClothingBrand.js`, rotas `/api/marcas-roupa` e testes `marcasRoupa.test.js`. |
| CRUD de usuários em SQL relacional | Model `User.js`, rotas `/api/usuarios` e testes `usuarios.test.js`. |
| Testes com Jest e Supertest | Pasta `backend/tests/` com testes de autenticação, usuários, bens e segurança. |
| Dockerfile | `backend/Dockerfile` para API e `frontend/Dockerfile` para interface. |
| docker-compose.yml | Arquivo `docker-compose.yml` orquestra backend, frontend, PostgreSQL, MongoDB e ambiente de testes. |
| Execução via Docker | README orienta `docker compose up --build` como fluxo principal. |
| Não depender de npm run dev/start | Execução principal usa Docker Compose; scripts npm ficam apenas como suporte interno dos containers. |
| Swagger | Documentação disponível em `/api-docs`, configurada em `backend/src/docs/swagger.js`. |
| Documentação escrita mínima | Seção [Documentação escrita da atividade](#documentação-escrita-da-atividade) descreve arquitetura, tecnologias e decisões. |
| Código-fonte da API | Código presente em `backend/src/`. |
| Frontend/site para gerenciamento | Interface React/Tailwind em `frontend/`, com cadastro, login e CRUD visual dos bens. |
| Link público via GitHub | Projeto preparado para publicação em repositório público. Basta subir a pasta `Avaliação2_Fullstack`. |

