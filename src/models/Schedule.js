'use strict';


module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
        doctorId: {
            type: DataTypes.BIGINT
        },
        date: {
            type: DataTypes.DATEONLY
        },
        timeId: {
            type: DataTypes.STRING
        },
        currentPatient: {
            type: DataTypes.INTEGER
        },
        maxPatient: {
            type: DataTypes.INTEGER
        },
    }, {});

    Schedule.associate = function (models) {
        // associations can be defined here
        Schedule.belongsTo(models.DoctorInfo, { foreignKey: 'doctorId', targetKey: 'doctorId', as: 'doctorData' });
        Schedule.belongsTo(models.Allcode, { foreignKey: 'timeId', targetKey: 'keyMap', as: 'timeData' });
    };

    return Schedule;
};
