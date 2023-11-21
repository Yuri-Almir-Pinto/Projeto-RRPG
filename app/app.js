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
const compression = require('compression');
const pug = require('pug');
const bodyParser = require('body-parser');
const { TEMPLATE, API_MESSAGES, API_USERS, deleteResetDatabase } = require(PATHS['routes']);

// Setando configurações no express.
// cors
    app = express();
    app.use(cors());
// template engine
    app.set('views', process.env.ROOT_PATH + "/app/static");
    app.set('view engine', 'pug');
// Static CSS
    app.use(express.static('app/static/'));
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
// Setar o express para assumir body de Json.
    app.use(express.json());

//#endregion

app.get("/api/message", API_MESSAGES.getMessage);
app.post("/api/message", API_MESSAGES.postMessage);

app.post("/api/validateLogin", API_USERS.postValidateLogin)
app.post("/api/validateRegister", API_USERS.postValidateRegister)

app.delete("/api/resetDatabase", deleteResetDatabase);

app.get("/", TEMPLATE.getHome);
app.get("/validate/login", TEMPLATE.getLogin);
app.get("/validate/register", TEMPLATE.getRegister);
app.get("/chat", TEMPLATE.getChat);

// app.get("/chat", TEMPLATE.getMain);

app.listen(process.env.PORT, function() {
    console.log(`Servidor rodando na porta ${process.env.PORT}.`);
})