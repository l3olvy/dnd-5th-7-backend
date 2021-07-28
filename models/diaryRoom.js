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
      thumbnailUrl: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      lock: {
        type: Boolean,
        defaultValue: false,
      },
      close: {
        type: Boolean,
        defaultValue: false,

      },
      star: {
        type: Boolean,
        defaultValue: false,
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
    db.Post.belongsTo(db.User, {
        foreignKey: 'admin', targetKey: "id"
    });
    db.DiaryRoom.hasMany(db.DiaryRoom, { foreignKey: "admin", sourceKey: "id" });
    db.DiaryRoom.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  }
};
