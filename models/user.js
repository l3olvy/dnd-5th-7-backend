const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      phothUrl: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      roomClose: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      roomDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'user',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {
    db.User.hasMany(db.Member, { foreignKey: "user_id", sourceKey: "id" });
    db.User.hasMany(db.DiaryContent, { foreignKey: "user_id", sourceKey: "id" });
    db.User.hasMany(db.Bookmark, { foreignKey: "user_id", sourceKey: "id" });
  }
};  
