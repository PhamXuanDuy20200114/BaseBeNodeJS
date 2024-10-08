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
        // Define associations here if necessary
    };

    return Allcode;
};
