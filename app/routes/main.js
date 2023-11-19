//#region --- Configurações ---

// Importando módulos
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const models = require(`${process.env.ROOT_PATH}/app/database/models`);
const path = require('path');
const compression = require('compression')
const pug = require('pug');
const bodyParser = require('body-parser')


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
    app.use(session({secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true}));
// Setar o uso de gzip (Comprimir )
    app.use(compression());
// Validação de sessáo
    app.use(require(process.env.ROOT_PATH + "/app/routes/session-handler.js"));

//#endregion

app.post("/sendMessage", async function(req, res) {
    const content = req.body.content;
    const userId = req.session.user.id;

    const result = await models.sendMessage(content, userId);

    await res.json(result);
})

app.get("/login", async function(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    const result = await models.login(login, password);
    
    if (result.error == null) {
        req.session.user = result;
        const timeout = process.env.SESSION_TIMEOUT_SECONDS;
        req.session.timeout = Date.now() + timeout*1000;
    }

    await res.json(result);
})

app.post("/register", async function(req, res) {
    const login = req.body.login;
    const senha = req.body.senha;
    const email = req.body.email;

    const result = await models.register(login, senha, email);

    if (result != null && result.error == null) {
        req.session.user = result;
        const timeout = process.env.SESSION_TIMEOUT_SECONDS;
        req.session.timeout = Date.now() + timeout*1000;
    }

    await res.json(result);
})

app.delete("/resetDatabase", async function(req, res) {
    await models.resetDatabase();

    await res.json({
        "result": "nice"
    })
})

app.listen(process.env.PORT, function() {
    console.log(`Servidor rodando na porta ${process.env.PORT}.`);
})