'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DoctorInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      doctorId: {
        type: Sequelize.BIGINT
      },
      priceId: {
        type: Sequelize.STRING,
      },
      positionId: {
        type: Sequelize.STRING,
      },
      paymentId: {
        type: Sequelize.STRING
      },
      clinicId: {
        type: Sequelize.STRING,
      },
      introduction: {
        type: Sequelize.TEXT,
      },
      specializations: {
        type: Sequelize.TEXT,
      },
      workProcess: {
        type: Sequelize.TEXT,
      },
      training: {
        type: Sequelize.TEXT,
      },
      project: {
        type: Sequelize.TEXT,
      },
      statusId: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('DoctorInfos');
  }
};
