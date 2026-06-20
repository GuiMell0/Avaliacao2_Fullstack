const app = require('./app');
const User = require('./models/sql/User');
const { env } = require('./config/env');
const { connectMongo } = require('./config/mongo');
const { connectPostgres } = require('./config/postgres');

async function seedDefaultAdmin() {
  const existing = await User.findOne({ where: { email: env.defaultAdmin.email } });

  if (!existing) {
    await User.create({
      nome: env.defaultAdmin.nome,
      email: env.defaultAdmin.email,
      senhaHash: env.defaultAdmin.senha,
      role: 'admin',
    });
    console.log(`Administrador padrão criado: ${env.defaultAdmin.email}`);
  }
}

async function startServer() {
  try {
    await connectPostgres();
    await connectMongo();
    await seedDefaultAdmin();

    app.listen(env.port, () => {
      console.log(`API rodando na porta ${env.port}`);
      console.log(`Swagger disponível em http://localhost:${env.port}/api-docs`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
