const Sequelize = require('sequelize');

module.exports = class Bookmark extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      mark: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Bookmark',
      tableName: 'bookmark',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Bookmark.belongsTo(db.User, {
      foreignKey: 'user_id', targetKey: "id",
      onDelete: 'cascade',
      hooks: true,
    });
    db.Bookmark.belongsTo(db.DiaryRoom, {
      foreignKey: 'room_id', targetKey: "id",
      onDelete: 'cascade',
      hooks: true,
    });
  }
};
