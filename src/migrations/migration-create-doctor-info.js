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
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
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
        type: Sequelize.BIGINT,
      },
      profile: {
        type: Sequelize.STRING,
        allowNull: false
      },
      certificate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descriptionHTML: {
        type: Sequelize.TEXT('long'),
      },
      descriptionText: {
        type: Sequelize.TEXT('long'),
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
