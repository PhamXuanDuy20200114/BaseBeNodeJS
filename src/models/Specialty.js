'use strict';


module.exports = (sequelize, DataTypes) => {
    const Specialty = sequelize.define('Specialty', {
        name: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        descriptionHTML: {
            type: DataTypes.TEXT('long')
        },
        descriptionText: {
            type: DataTypes.TEXT('long')
        }
    }, {});

    Specialty.associate = function (models) {
        Specialty.belongsToMany(models.DoctorInfo, { through: models.DoctorSpecialty, foreignKey: 'specialtyId', otherKey: 'doctorId', as: 'doctorData' });
    };

    return Specialty;
};
