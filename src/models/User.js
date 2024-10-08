'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING
        },
        phonenumber: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.STRING
        },
        roleId: {
            type: DataTypes.STRING,
        },
        refreshtoken: {
            type: DataTypes.STRING
        }
    }, {});

    User.associate = function (models) {
        User.hasOne(models.DoctorInfo, { foreignKey: 'doctorId', as: 'doctorData' });
    };

    return User;
};
