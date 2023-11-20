const PATHS = require(process.env.PATH_MANAGER);
const { isResponseValid } = require(PATHS['errorHandler']);

async function getMain(req, res) {
    res.sendFile(`${process.env.ROOT_PATH}/app/static/HTML/index/main.html`);
}

async function getLogin(req, res) {
    res.sendFile(`${process.env.ROOT_PATH}/app/static/HTML/index/main.html`);
}

async function getMain(req, res) {
    res.sendFile(`${process.env.ROOT_PATH}/app/static/HTML/index/main.html`);
}

module.exports = { getMain };