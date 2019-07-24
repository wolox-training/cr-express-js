'use strict';
/* eslint-disable new-cap*/

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM(['regular', 'admin']),
      allowNUll: false,
      defaultValue: 'regular'
    }),
  down: queryInterface => queryInterface.removeColumn('users', 'role')
};
