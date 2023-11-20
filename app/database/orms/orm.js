require('dotenv').config();
const PATHS = require(process.env.PATH_MANAGER)
const { sequelize, DataTypes } = require(PATHS['authenticate']);
const errorHandler = require(PATHS['errorHandler']);

// Importando as orms
    const { Users } = require(PATHS['orm-users']);
    const { Messages } = require(PATHS['orm-messages']);

Users.hasMany(Messages);
Messages.belongsTo(Users, {
    foreignKey: {
        allowNull: false,
    }
})

Users.sync();
Messages.sync();

module.exports = { DataTypes, sequelize, Messages, Users }

