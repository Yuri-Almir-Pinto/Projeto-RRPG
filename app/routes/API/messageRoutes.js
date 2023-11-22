const PATHS = require(process.env.PATH_MANAGER);
const { Messages } = require(PATHS['model']);
const { isResponseValid } = require(PATHS['errorHandler']);
let io;

setTimeout(async () => {
    io = await require(PATHS['socketHandler']);
}, 2000)

async function getMessage(req, res) {
    const result = await Messages.getMessages();

    await isResponseValid(result, res);

    await res.json(result);
}

async function postMessage(req, res) {
    const content = req.body.content;
    const userId = req.session.user.id;

    const result = await Messages.sendMessage(content, userId);

    if (await isResponseValid(result, res)) {
        io.emit("message", result);
    }
        

    await res.json(result);
}

module.exports = { getMessage, postMessage };