'use strict';


module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        patientId: {
            type: DataTypes.BIGINT
        },
        doctorId: {
            type: DataTypes.BIGINT
        },
        address: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        relativeName: {
            type: DataTypes.STRING
        },
        relativePhone: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATEONLY
        },
        timeId: {
            type: DataTypes.STRING
        },
        reason: {
            type: DataTypes.TEXT
        },
        result:{
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING
        },
    }, {});

    Booking.associate = function (models) {
        // associations can be defined here
        Booking.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
        Booking.belongsTo(models.DoctorInfo, { foreignKey: 'doctorId', targetKey: 'doctorId', as: 'doctor' });
        Booking.belongsTo(models.Allcode, { foreignKey: 'timeId', targetKey: 'keyMap', as: 'timeData' });
    }
    return Booking;
};
