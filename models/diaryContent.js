const Sequelize = require('sequelize');

module.exports = class DiaryContent extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      text: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      imgUrl: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'DiaryContent',
      tableName: 'diaryContent',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.DiaryContent.belongsTo(db.User, {
      foreignKey: 'user_id', targetKey: "id"
    });
    db.DiaryContent.belongsTo(db.DiaryRoom, {
      foreignKey: 'room_id', targetKey: "id",
      onDelete: 'cascade',
      hooks: true,
    });
  }
};
