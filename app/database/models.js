require('dotenv').config();
const { NotUniqueError } = require('../errorHandler');
const db = require('./orm');
const errorHandler = require(`${process.env.ROOT_PATH}/app/errorHandler`);
const { Sequelize, SequelizeScopeError, ValidationError, UniqueConstraintError } = require('sequelize');

//#region --- General ----
async function resetDatabase() {
    await db.Messages.drop();
    await db.Users.drop();

    await db.Users.sync();
    await db.Messages.sync();
}

module.exports.resetDatabase = resetDatabase;

//#endregion

//#region --- Messages ---

async function sendMessage(content, userId) {
    const trans = await db.sequelize.transaction();
    
    try {
        const message = await db.Messages.build({
            content: content,
            userId: userId
        });
        
        await message.save();

        await trans.commit();

        return message;
    }
    catch(err) {
        await trans.rollback();
        if (err instanceof errorHandler.InvalidIdentifierError) {
            return err.toJson();
        }
        if (err instanceof ValidationError) {
            const FIRST_ERROR = 0;
            if (err.errors[FIRST_ERROR].type.includes("notNull")) {
                return new errorHandler.NullInputError("Id de usuário nulo.").toJson();
            }
        }
        console.log("Erro ao tentar enviar uma mensagem: " + err);
    }
}
/**
 * Reads all messages in the database, and returns an array containing all of them.
 * @returns {[Messages]}
 * @example
 * const messages = getMessages();
 * messages.forEach(function(val) {
 *  console.log(val.content); // Outputs every message's content.
 * })
 */
async function getMessages() {
    let query = await db.Messages.findAll();

    let messages = [];
    query.forEach(function(val) {
        messages.push(val.dataValues);
    })
    return messages;
}

module.exports.getMessages = getMessages;
module.exports.sendMessage = sendMessage;

//#endregion

//#region --- Users ---
async function register(login, senha, email) {
    const trans = await db.sequelize.transaction();
    try {
        if (login != null && senha != null & email != null) {
            const user = db.Users.build({
                login: login,
                password: senha,
                email: email
            })
    
            await user.save();

            await trans.commit();
    
            return user;
        }
        else {
            throw new errorHandler.NullInputError(null, {
                "nulls": {
                    "login": login == null ? true : false,
                    "senha": senha == null ? true : false,
                    "email": email == null ? true : false
                }
            });
        }
    }
    catch(err) {
        trans.rollback();
        if (err instanceof errorHandler.NullInputError) {
            return err.toJson();
        }
        if (err instanceof ValidationError) {
            const FIRST_ERROR = 0;
            if (err.errors[FIRST_ERROR].type.includes("unique")) {
                return new NotUniqueError("Login ou email já usados.").toJson();
            }
        }
        console.log("Erro ao tentar registrar usuário: " + err);
    }
}

async function login(login, password) {
    try {
        const userQuery = await db.Users.findOne({
            where: {
                "login": login,
            }
        });

        if (userQuery != null) {
            const user = userQuery.dataValues;
            if (user.password == password) {
                return user;
            }
            else {
                throw new errorHandler.InvalidCredentialsError();
            }
        }
        else {
            throw new errorHandler.InvalidCredentialsError();
        }
    }
    catch(err) {
        if (err instanceof errorHandler.InvalidCredentialsError) {
            return err.toJson();
        }
        return err;
    }
}

module.exports.register = register;
module.exports.login = login;

//#endregion




