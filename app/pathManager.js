require('dotenv').config()
const root = process.env.ROOT_PATH;

const PATHS = {
    "orm": `${root}/app/database/orms/orm`,
    "orm-messages": `${root}/app/database/orms/messagesOrm`,
    "orm-users": `${root}/app/database/orms/usersOrm`,
    "model": `${root}/app/database/models/model`,
    "model-users":  `${root}/app/database/models/usersModel`,
    "model-messages":  `${root}/app/database/models/messagesModel`,
    "authenticate": `${root}/app/database/authenticate`,
    "sessionHandler": `${root}/app/routes/sessionHandler`,
    "errorHandler": `${root}/app/errorHandler`,
}

module.exports = PATHS;