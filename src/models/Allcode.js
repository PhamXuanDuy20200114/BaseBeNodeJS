'use strict';

module.exports = (sequelize, DataTypes) => {
    const Allcode = sequelize.define('Allcode', {
        keyMap: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.STRING,
        }
    }, {});

    Allcode.associate = function (models) {
        Allcode.hasMany(models.User, { foreignKey: 'roleId', sourceKey: 'keyMap', as: 'roleData' });
        Allcode.hasMany(models.User, { foreignKey: 'gender', sourceKey: 'keyMap', as: 'genderData' });
        Allcode.hasMany(models.DoctorInfo, { foreignKey: 'priceId', sourceKey: 'keyMap', as: 'priceData' });
        Allcode.hasMany(models.DoctorInfo, { foreignKey: 'positionId', sourceKey: 'keyMap', as: 'positionData' });
        Allcode.hasMany(models.DoctorInfo, { foreignKey: 'paymentId', sourceKey: 'keyMap', as: 'paymentData' });
        Allcode.hasMany(models.DoctorInfo, { foreignKey: 'statusId', sourceKey: 'keyMap', as: 'statusData' });
        Allcode.hasMany(models.Clinic, { foreignKey: 'provinceId', sourceKey: 'keyMap', as: 'provinceData' });
        Allcode.hasMany(models.Schedule, { foreignKey: 'timeId', sourceKey: 'keyMap', as: 'scheduleTimeData' });
        Allcode.hasMany(models.Booking, { foreignKey: 'timeId', sourceKey: 'keyMap', as: 'bookingTimeData' });
    };

    return Allcode;
};
