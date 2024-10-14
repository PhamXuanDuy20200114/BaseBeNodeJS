'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
        },
        birthdate: {
            type: DataTypes.DATEONLY,
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
        User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey: 'keyMap', as: 'roleData' });
        User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' });
        User.hasOne(models.DoctorInfo, { foreignKey: 'doctorId', as: 'doctorData' });
    };

    return User;
};
