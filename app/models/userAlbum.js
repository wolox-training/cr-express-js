module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'user_album',
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'id'
        },
        field: 'user_id',
        allowNull: false
      },
      albumId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'album_id',
        allowNull: false
      }
    },
    { underscored: true }
  );
