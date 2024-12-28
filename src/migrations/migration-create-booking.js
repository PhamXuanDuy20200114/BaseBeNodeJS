'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      patientId: {
        type: Sequelize.BIGINT
      },
      doctorId: {
        type: Sequelize.BIGINT
      },
      address: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      relativeName: {
        type: Sequelize.STRING
      },
      relativePhone: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY
      },
      timeId: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.TEXT
      },
      result: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Bookings');
  }
};
