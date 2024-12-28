'use strict';

module.exports = (sequelize, DataTypes) => {
    const CensorNotebook = sequelize.define('CensorNotebook', {
        censorId: {
            type: DataTypes.BIGINT
        },
        notebookId: {
            type: DataTypes.BIGINT
        },
    }, {});

    CensorNotebook.associate = function (models) {

    };

    return CensorNotebook;
};
