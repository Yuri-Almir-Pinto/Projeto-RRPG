const PATHS = require(process.env.PATH_MANAGER);

async function getHome(req, res) {
    await res.render('HTML/home/home');
}

async function getLogin(req, res) {
    await res.render('HTML/login/login', { register: false });
}

async function getRegister(req, res) {
    await res.render('HTML/login/login', { register: true });
}

async function getChat(req, res) {
    await res.render('HTML/chat/chat', { userId: req.session.user.id });
}

module.exports = { getHome, getLogin, getRegister, getChat };