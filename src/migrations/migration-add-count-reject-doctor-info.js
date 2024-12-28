'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('DoctorInfos', 'countReject', {
      type: Sequelize.BIGINT, // Kiểu dữ liệu của cột
      allowNull: true, // Có cho phép null hay không
      defaultValue: 0, // Giá trị mặc định (nếu cần)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('DoctorInfos', 'countReject');
  },
};
