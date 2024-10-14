'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DoctorSpecialtys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      doctorid: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      specialtyid: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DoctorSpecialtys');
  }
};
