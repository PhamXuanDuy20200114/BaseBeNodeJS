'use strict';

const { type } = require("express/lib/response");

module.exports = (sequelize, DataTypes) => {
    const DoctorInfo = sequelize.define('DoctorInfo', {
        doctorId: {
            type: DataTypes.BIGINT
        },
        priceId: {
            type: DataTypes.STRING,
        },
        positionId: {
            type: DataTypes.STRING,
        },
        paymentId: {
            type: DataTypes.STRING
        },
        clinicId: {
            type: DataTypes.STRING,
        },
        introduction: {
            type: DataTypes.TEXT,
        },
        specializations: {
            type: DataTypes.TEXT,
        },
        workProcess: {
            type: DataTypes.TEXT,
        },
        training: {
            type: DataTypes.TEXT,
        },
        project: {
            type: DataTypes.TEXT,
        },
        statusId: {
            type: DataTypes.STRING,
        }
    }, {});

    DoctorInfo.associate = function (models) {
        // Define associations here if necessary
        DoctorInfo.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorData' });
    };

    return DoctorInfo;
};
