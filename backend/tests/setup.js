const mongoose = require('mongoose');
const { sequelize } = require('../src/config/postgres');
const { connectPostgres } = require('../src/config/postgres');
const { connectMongo } = require('../src/config/mongo');
const User = require('../src/models/sql/User');
const Car = require('../src/models/nosql/Car');
const Motorcycle = require('../src/models/nosql/Motorcycle');
const ClothingBrand = require('../src/models/nosql/ClothingBrand');

beforeAll(async () => {
  await connectPostgres();
  await sequelize.sync({ force: true });
  await connectMongo();
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  await Promise.all([
    Car.deleteMany({}),
    Motorcycle.deleteMany({}),
    ClothingBrand.deleteMany({}),
  ]);
});

afterAll(async () => {
  await sequelize.close();
  await mongoose.connection.close();
});
