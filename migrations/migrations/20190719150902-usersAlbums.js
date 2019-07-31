'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('user_albums', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false
      },
      album_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('user_albums')
};
