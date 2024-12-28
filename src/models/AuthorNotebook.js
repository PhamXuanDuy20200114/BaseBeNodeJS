'use strict';

module.exports = (sequelize, DataTypes) => {
    const AuthorNotebook = sequelize.define('AuthorNotebook', {
        authorId: {
            type: DataTypes.BIGINT
        },
        notebookId: {
            type: DataTypes.BIGINT
        },
    }, {});

    AuthorNotebook.associate = function (models) {

    };

    return AuthorNotebook;
};
