'use strict';

const { type } = require("express/lib/response");

module.exports = (sequelize, DataTypes) => {
    const DoctorSpecialty = sequelize.define('DoctorSpecialty', {
        doctorId: {
            type: DataTypes.BIGINT
        },
        specialtyId: {
            type: DataTypes.BIGINT
        },
    }, {});

    DoctorSpecialty.associate = function (models) {

    };

    return DoctorSpecialty;
};
