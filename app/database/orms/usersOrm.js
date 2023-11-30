// Crie um objeto do sequelize, e passe como parâmetro na criação do objeto: nome do banco de dados, nome de usuário, senha, e um objeto com
// "host" (localhost nesse caso) e "dialect" (mysql).

// Se quiser, utilize a função "authenticate" do sequelize para verificar que tudo deu certo (then/catch).
require('dotenv').config();
const PATHS = require(process.env.PATH_MANAGER)
const { sequelize, DataTypes } = require(PATHS['authenticate']);

const Users = sequelize.define("users", {
    login: { 
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    }
});

module.exports = { Users };