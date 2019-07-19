const userAlbum = require('./userAlbum');

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'user',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM(['regular', 'admin']),
        allowNUll: false,
        defaultValue: 'regular'
      }
    },
    { underscored: true }
  );
