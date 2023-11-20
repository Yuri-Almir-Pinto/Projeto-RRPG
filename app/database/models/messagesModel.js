require('dotenv').config();
const PATHS = require(process.env.PATH_MANAGER);
const db = require(PATHS['orm']);
const errorHandler = require(PATHS['errorHandler']);
const { ValidationError } = require('sequelize');

/**
 * Receives the content being sent, and a userId, and if the user exists in the database, creates a message under its name.
 * @param {String} content 
 * @param {Integer} userId 
 * @throws {InvalidIdentifierError} Throws if the user specified by the userId does not exist in the database.
 * @throws {NullInputError} Throws if either the content or the userId is null.
 * @returns 
 */
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
            return err;
        }
        if (err instanceof ValidationError) {
            const FIRST_ERROR = 0;
            if (err.errors[FIRST_ERROR].type.includes("notNull")) {
                return new errorHandler.NullInputError("Conteúdo da mensagem nulo.");
            }
        }
        console.log("Erro ao tentar enviar uma mensagem: " + err);
    }
}
/**
 * Reads all messages in the database, and returns an array containing all of them.
 * @returns {[Messages]}
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