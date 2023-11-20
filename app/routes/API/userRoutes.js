const PATHS = require(process.env.PATH_MANAGER);
const { Users } = require(PATHS['model']);
const { isResponseValid } = require(PATHS['errorHandler']);

async function getValidate(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    const result = await Users.login(login, password);
    
    if (await isResponseValid(result, res)) 
        req.session.user = result;

    return await res.json(result);
}

async function postValidate(req, res) {
    const login = req.body.login;
    const senha = req.body.senha;
    const email = req.body.email;

    const result = await Users.register(login, senha, email);

    if (await isResponseValid(result, res)) 
        req.session.user = result;

    await res.json(result);
}

module.exports = { getValidate, postValidate };