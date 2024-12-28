'use strict';


module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        patientId: {
            type: DataTypes.BIGINT
        },
        doctorId: {
            type: DataTypes.BIGINT
        },
        clinicId: {
            type: DataTypes.BIGINT
        },
        content: {
            type: DataTypes.TEXT
        },
        parentId: {
            type: DataTypes.BIGINT
        }
    }, {});

    Comment.associate = function (models) {
        // associations can be defined here
        Comment.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientComment' });
        Comment.belongsTo(models.DoctorInfo, { foreignKey: 'doctorId', targetKey: 'doctorId', as: 'doctorComment' });
        Comment.belongsTo(models.Clinic, { foreignKey: 'clinicId', targetKey: 'id', as: 'clinicComment' });
    }
    return Comment;
};
