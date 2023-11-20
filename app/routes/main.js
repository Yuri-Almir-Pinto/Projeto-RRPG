//#region --- Configurações ---

// Importando módulos
require('dotenv').config();
// Checando se todas as variáveis de ambiente estão setadas.
(() => {
    const variables = [
        "PORT", "DB_NAME", "DB_USERNAME", "DB_PASSWORD", "DB_HOST", "SESSION_SECRET", "SESSION_TIMEOUT_SECONDS", 
        "ROOT_PATH", "PATH_MANAGER"
    ];
    
    let shouldQuit = false;
    for (const vars of variables) {
        if (process.env[vars] == null || process.env[vars] == '') {
            console.warn(`Variável de ambiente '${vars}' não foi atribuida.`);
            shouldQuit = true;
        }
    }
    if (shouldQuit)
        process.exit();
})()
const PATHS = require(process.env.PATH_MANAGER);
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { Users, Messages, resetDatabase } = require(PATHS['model']);
const compression = require('compression');
const pug = require('pug');
const bodyParser = require('body-parser');
const { isResponseValid } = require(PATHS['errorHandler']);

// Setando configurações no express.
// cors
    app = express();
    app.use(cors());
// template engine
    app.set('views', process.env.ROOT_PATH + "app/view");
    app.set('view engine', 'pug');
// Static CSS
    app.use(express.static(process.env.ROOT_PATH + "app/view"));
// Body Parser
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
// Sessions
    app.use(session({secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: false, cookie: {
        maxAge: (process.env.SESSION_TIMEOUT_SECONDS * 1000)
    }}));
// Setar o uso de gzip (Comprimir )
    app.use(compression());
// Validação de sessáo
    app.use(require(PATHS['sessionHandler']));

//#endregion

app.post("/message", async function(req, res) {
    const content = req.body.content;
    const userId = req.session.user.id;

    const result = await Messages.sendMessage(content, userId);

    await isResponseValid(result, res);

    await res.json(result);
})

app.get("/message", async function(req, res) {
    const result = await Messages.getMessages();

    await isResponseValid(result, res);

    await res.json(result);
})

app.get("/login", async function(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    const result = await Users.login(login, password);
    
    if (await isResponseValid(result, res)) {
        req.session.user = result;
        const timeout = process.env.SESSION_TIMEOUT_SECONDS;
        req.session.timeout = Date.now() + timeout*1000;
    }

    return await res.json(result);
})

app.post("/register", async function(req, res) {
    const login = req.body.login;
    const senha = req.body.senha;
    const email = req.body.email;

    const result = await Users.register(login, senha, email);

    if (await isResponseValid(result, res)) {
        req.session.user = result;
        const timeout = process.env.SESSION_TIMEOUT_SECONDS;
        req.session.timeout = Date.now() + timeout*1000;
    }

    await res.json(result);
})

app.delete("/resetDatabase", async function(req, res) {
    await resetDatabase();

    await res.json({
        "result": "nice"
    })
})

app.listen(process.env.PORT, function() {
    console.log(`Servidor rodando na porta ${process.env.PORT}.`);
})