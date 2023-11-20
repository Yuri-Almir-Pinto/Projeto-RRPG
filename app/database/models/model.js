require('dotenv').config();
const PATHS = require(process.env.PATH_MANAGER)
const errorHandler= require(PATHS['errorHandler']);
const db = require(PATHS['orm']);
const Users = require(PATHS['model-users']);
const Messages = require(PATHS['model-messages']);

//#region --- General ----
async function resetDatabase() {
    await db.Messages.drop();
    await db.Users.drop();

    await db.Users.sync();
    await db.Messages.sync();
}

module.exports = { Users, Messages, resetDatabase }




