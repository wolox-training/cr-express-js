module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'userAlbum',
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: 'users',
        referencesKey: 'id'
      },
      albumId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      }
    },
    { underscored: true }
  );
