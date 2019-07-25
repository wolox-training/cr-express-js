'use strict';
/* eslint-disable new-cap*/

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM(['regular', 'admin']),
      allowNUll: false,
      defaultValue: 'regular'
    }),
  down: queryInterface =>
    queryInterface
      .removeColumn('users', 'role')
      .then(() => queryInterface.sequelize.query('DROP TYPE enum_users_role CASCADE;'))
};
