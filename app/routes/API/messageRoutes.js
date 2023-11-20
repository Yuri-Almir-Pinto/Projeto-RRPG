const PATHS = require(process.env.PATH_MANAGER);
const { Messages } = require(PATHS['model']);
const { isResponseValid } = require(PATHS['errorHandler']);

async function getMessage(req, res) {
    const result = await Messages.getMessages();

    await isResponseValid(result, res);

    await res.json(result);
}

async function postMessage(req, res) {
    const content = req.body.content;
    const userId = req.session.user.id;

    const result = await Messages.sendMessage(content, userId);

    await isResponseValid(result, res);

    await res.json(result);
}

module.exports = { getMessage, postMessage };