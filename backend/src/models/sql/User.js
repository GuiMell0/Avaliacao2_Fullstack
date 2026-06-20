const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/postgres');

class User extends Model {
  async checkPassword(senha) {
    return bcrypt.compare(senha, this.senhaHash);
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.senhaHash;
    delete values.senha_hash;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    senhaHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'senha_hash',
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'usuarios',
  },
);

User.beforeCreate(async (user) => {
  if (user.senhaHash && !user.senhaHash.startsWith('$2')) {
    user.senhaHash = await bcrypt.hash(user.senhaHash, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('senhaHash') && user.senhaHash && !user.senhaHash.startsWith('$2')) {
    user.senhaHash = await bcrypt.hash(user.senhaHash, 10);
  }
});

module.exports = User;
