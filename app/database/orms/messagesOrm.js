// Crie um objeto do sequelize, e passe como parâmetro na criação do objeto: nome do banco de dados, nome de usuário, senha, e um objeto com
// "host" (localhost nesse caso) e "dialect" (mysql).

// Se quiser, utilize a função "authenticate" do sequelize para verificar que tudo deu certo (then/catch).
require('dotenv').config();
const PATHS = require(process.env.PATH_MANAGER);
const { DataTypes, sequelize } = require(PATHS['authenticate']);
const { Users } = require(PATHS['orm-users']);
const errorHandler = require(PATHS['errorHandler']);

const Messages = sequelize.define("messages", {
    content: { 
        type: DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
});

Messages.beforeValidate(async (message, options) => {
    try {
        const userQuery = await Users.findByPk(message.userId);
        if (userQuery?.dataValues.login != null) {
            const user = userQuery.dataValues;
            message.name = user.login;
        }
        else {
            throw new errorHandler.InvalidIdentifierError("Id de usuário inválido");
        }
    }
    catch(err) {
        if (err instanceof errorHandler.InvalidIdentifierError) {
            throw err;
        }
        console.log("Erro ao tentar encontrar usuário da mensagem pelo seu ID: " + err);
    }
    
});


module.exports = { Messages };