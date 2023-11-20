const PATHS = require(process.env.PATH_MANAGER);
const API_MESSAGES = require(PATHS['route-messages']);
const API_USERS = require(PATHS['route-users']);
const TEMPLATE = require(PATHS['route-template'])

async function deleteResetDatabase(req, res) {
    await resetDatabase();

    await res.json({
        "result": "nice"
    })
}

module.exports = { TEMPLATE, API_MESSAGES, API_USERS, deleteResetDatabase };