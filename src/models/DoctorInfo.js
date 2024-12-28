'use strict';

const { type } = require("express/lib/response");

module.exports = (sequelize, DataTypes) => {
    const DoctorInfo = sequelize.define('DoctorInfo', {
        doctorId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true
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
            type: DataTypes.BIGINT,
        },
        profile: {
            type: DataTypes.STRING,
            allowNull: false
        },
        certificate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descriptionHTML: {
            type: DataTypes.TEXT('long'),
        },
        descriptionText: {
            type: DataTypes.TEXT('long'),
        },
        statusId: {
            type: DataTypes.STRING,
        }
    }, {});

    DoctorInfo.associate = function (models) {
        // Define associations here if necessary
        DoctorInfo.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorData' });
        DoctorInfo.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceData' });
        DoctorInfo.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' });
        DoctorInfo.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentData' });
        DoctorInfo.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusData' });
        DoctorInfo.belongsTo(models.Clinic, { foreignKey: 'clinicId', targetKey: 'id', as: 'clinicData' });
        DoctorInfo.belongsToMany(models.Specialty, { through: models.DoctorSpecialty, foreignKey: 'doctorId', sourceKey: 'doctorId', as: 'specialtyData' });
        DoctorInfo.hasMany(models.Schedule, { foreignKey: 'doctorId', sourceKey: 'doctorId', as: 'scheduleData' });
        DoctorInfo.hasMany(models.Booking, { foreignKey: 'doctorId', sourceKey: 'doctorId', as: 'bookingData' });
    };

    return DoctorInfo;
};
