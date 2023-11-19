const sessionHandler = function (req, res, next) {
    if (req.path == "/login" || req.path == "/register")
        return next();

    if (req.session.user == null) {
        return res.json({
            error: {
                name: "invalidSession",
                message: "Sessão de usuário inválida."
            }
        })
    }
    else {
        if (req.session.timeout < Date.now()) {
            req.session.user = null;
            req.session.timeout = null;
            return res.json({
                error: {
                    name: "invalidSession",
                    message: "Sessão de usuário inválida."
                }
            })
        }
        else {
        next();
        }
    }
}

module.exports = sessionHandler;