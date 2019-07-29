'use strict';
/* eslint-disable new-cap*/
const { default_role } = require('../../app/constants');
const { admin_role } = require('../../app/constants');

module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('users', 'role', {
        type: Sequelize.ENUM([default_role, admin_role]),
        allowNull: false,
        defaultValue: default_role
      }),
      queryInterface.addColumn('users', 'base_allowed_date_token', {
        type: Sequelize.DATE,
        defaultValue: Date.now(),
        allowNull: false
      })
    ]),
  down: queryInterface =>
    Promise.all([
      queryInterface
        .removeColumn('users', 'role')
        .then(() => queryInterface.sequelize.query('DROP TYPE enum_users_role')),
      queryInterface.removeColumn('users', 'base_allowed_date_token')
    ])
};
