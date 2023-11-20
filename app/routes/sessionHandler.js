const { isResponseValid } = require("../errorHandler");

const PATHS = require(process.env.PATH_MANAGER);
const { InvalidSessionError} = require(PATHS['errorHandler']);

const sessionHandler = function (req, res, next) {
    debugger;
    if (req.path == "/api/validate")
        return next();

    if (req.session.user == null) {
        error = new InvalidSessionError();
        isResponseValid(error, res);
        return res.json(error);
    }
    else {
        next();
        
    }
}

module.exports = sessionHandler;