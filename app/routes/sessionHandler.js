const { isResponseValid } = require("../errorHandler");

const PATHS = require(process.env.PATH_MANAGER);
const { InvalidSessionError} = require(PATHS['errorHandler']);

const sessionHandler = function (req, res, next) {
    console.log(req.session.user);
    if (req.path == "/api/validate" || req.path == "/"||req.path.match(/\/validate\/*/) || req.path == "/favicon.ico")
        return next();

    if (req.session.user == null) {
        error = new InvalidSessionError();
        isResponseValid(error, res);
        return res.render("HTML/home/home");
    }
    else {
        next();
        
    }
}

module.exports = sessionHandler;