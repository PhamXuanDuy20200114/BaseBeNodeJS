'use strict';

module.exports = (sequelize, DataTypes) => {
    const Clinic = sequelize.define('Clinic', {
        name: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        phonenumber: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        website: {
            type: DataTypes.STRING
        },
        districtID: {
            type: DataTypes.STRING
        },

        provinceId: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        background: {
            type: DataTypes.STRING
        },
        descriptionHTML: {
            type: DataTypes.TEXT('long')
        },
        descriptionText: {
            type: DataTypes.TEXT('long')
        }

    }, {});

    Clinic.associate = function (models) {
        // associations can be defined here
        Clinic.belongsTo(models.Allcode, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceData' });
    };

    return Clinic;
};
