/* eslint-disable new-cap*/
const { default_role } = require('../constants');
const { admin_role } = require('../constants');

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
        type: DataTypes.ENUM([default_role, admin_role]),
        allowNull: false,
        defaultValue: default_role
      },
      baseAllowedDateToken: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'base_allowed_date_token'
      }
    },
    {
      underscored: true
    }
  );
