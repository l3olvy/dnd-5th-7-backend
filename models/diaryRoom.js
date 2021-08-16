const Sequelize = require('sequelize');

module.exports = class DiaryRoom extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      mood: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      date: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'DiaryRoom',
      tableName: 'diaryRoom',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.DiaryRoom.hasMany(db.Member, {
      foreignKey: "room_id", sourceKey: "id"
    });
    db.DiaryRoom.hasMany(db.DiaryContent, {
      foreignKey: "room_id", sourceKey: "id"
    });
    db.DiaryRoom.hasMany(db.Bookmark, {
      foreignKey: "room_id", sourceKey: "id"
    });
    db.DiaryRoom.belongsTo(db.User, {
      foreignKey: 'user_id', targetKey: "id",
      onDelete: 'set null'
    });
  }
};
