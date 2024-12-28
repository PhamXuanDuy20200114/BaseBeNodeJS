'use strict';


module.exports = (sequelize, DataTypes) => {
    const Notebook = sequelize.define('Notebook', {
        title: {
            type: DataTypes.STRING
        },
        contentHTML: {
            type: DataTypes.TEXT('long')
        },
        contentText: {
            type: DataTypes.TEXT('long')
        },
        image: {
            type: DataTypes.STRING
        }
    }, {});

    Notebook.associate = function (models) {
        // associations can be defined here
        Notebook.belongsToMany(models.User, { through: models.AuthorNotebook, foreignKey: 'notebookId', as: 'authorData' });
        Notebook.belongsToMany(models.User, { through: models.CensorNotebook, foreignKey: 'notebookId', as: 'censorData' });

    }
    return Notebook;
};
