'use strict';
/* eslint-disable new-cap*/
const { default_role } = require('../../app/constants');
const { admin_role } = require('../../app/constants');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM([default_role, admin_role]),
      allowNUll: false,
      defaultValue: default_role
    }),
  down: queryInterface =>
    queryInterface
      .removeColumn('users', 'role')
      .then(() => queryInterface.sequelize.query('DROP TYPE enum_users_role'))
};
