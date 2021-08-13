'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Member', // name of Source model
      'room_id', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'DiaryRoom', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Member', // name of Source model
      'room_id' // key we want to remove
    );
  }
};