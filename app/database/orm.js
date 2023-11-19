// Crie um objeto do sequelize, e passe como parâmetro na criação do objeto: nome do banco de dados, nome de usuário, senha, e um objeto com
// "host" (localhost nesse caso) e "dialect" (mysql).

// Se quiser, utilize a função "authenticate" do sequelize para verificar que tudo deu certo (then/catch).
require('dotenv').config();
const { sequelize, DataTypes, Model} = require('./authenticate');
const errorHandler = require(`${process.env.ROOT_PATH}/app/errorHandler`);

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
    
})



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
})

Users.hasMany(Messages);
Messages.belongsTo(Users, {
    foreignKey: {
        allowNull: false,
    }
})

Users.sync();
Messages.sync();

module.exports.DataTypes = DataTypes;
module.exports.sequelize = sequelize;
module.exports.Messages = Messages;
module.exports.Users = Users;

