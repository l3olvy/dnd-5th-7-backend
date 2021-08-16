const Sequelize = require('sequelize');

module.exports = class Alarm extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            delete: {
                type: Sequelize.STRING(120),
                allowNull: true,
            },
            read: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Alarm',
            tableName: 'alarm',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Alarm.belongsTo(db.User, {
            foreignKey: 'user_id', targetKey: "id",
            onDelete: 'cascade'
        });
    }
};
