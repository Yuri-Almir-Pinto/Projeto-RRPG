require('dotenv').config();
const PATHS = require(process.env.PATH_MANAGER);
const db = require(PATHS['orm']);
const errorHandler = require(PATHS['errorHandler']);
const { ValidationError } = require('sequelize');
/**
 * Receives a login, password and email, and registers it as a user in the database, returning the user object from the database.
 * @param {String} login 
 * @param {String} senha 
 * @param {String} email 
 * @throws {NullInputError} No arguments may be null
 * @throws {NotUniqueError} Login and email must be unique in the database.
 * @returns {User}
 * 
 */
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
            return err;
        }
        if (err instanceof ValidationError) {
            const FIRST_ERROR = 0;
            if (err.errors[FIRST_ERROR].type.includes("unique")) {
                return new errorHandler.NotUniqueError("Login ou email já usados.");
            }
        }
        console.log("Erro ao tentar registrar usuário: " + err);
    }
}
/**
 * Receives a login and a password, and if the login is present, and password is correct, returns the database user object. If anything is incorrect, returns an InvalidCredentialsError.
 * @param {String} login 
 * @param {String} password
 * @throws {InvalidCredentialsError} Login must exist in the database, and password must match the login's password.
 * @returns {User}
 */
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
            return err;
        }
        console.log("Erro ao tentar logar com usuário: " + err);
    }
}

module.exports.register = register;
module.exports.login = login;