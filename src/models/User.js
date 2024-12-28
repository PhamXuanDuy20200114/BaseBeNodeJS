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
        User.hasOne(models.DoctorInfo, { foreignKey: 'doctorId', sourceKey: 'id', as: 'doctorData' });
        User.hasMany(models.Booking, { foreignKey: 'patientId', sourceKey: 'id', as: 'patientData' });
        User.belongsToMany(models.Notebook, { through: models.AuthorNotebook, foreignKey: 'authorId', sourceKey: 'id', as: 'authorData' });
        User.belongsToMany(models.Notebook, { through: models.CensorNotebook, foreignKey: 'censorId', sourceKey: 'id', as: 'censorData' });
        User.hasMany(models.Comment, { foreignKey: 'patientId', sourceKey: 'id', as: 'commentData' });
    };

    return User;
};
