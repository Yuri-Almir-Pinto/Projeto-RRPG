const { StatusCodes } = require('http-status-codes');

class ErrorTemplate {
    constructor() {
        if (new.target === ErrorTemplate) {
            throw new Error("ErrorTemplate should not be instantiated directly.");
        }
    }
}

class NullInputError extends ErrorTemplate {
    constructor(message = null, data = null) {
        super()
        this.name = "NullInputError";
        this.message = message !== null ? message : "Valor enviado é nulo.";
        this.data = data;
    };
};

class InvalidCredentialsError extends ErrorTemplate {
    constructor(message = null, data = null) {
        super();
        this.name = "InvalidCredentialsError";
        this.message = message !== null ? message : "Credenciais enviadas são inválidas.";
        this.data = data
    }
};

class InvalidIdentifierError extends ErrorTemplate {
    constructor(message = null, data = null) {
        super();
        this.name = "InvalidIdentifierError";
        this.message = message !== null ? message : "Identificador enviado é inválido.";
        this.data = data
    }
    
};

class NotUniqueError extends ErrorTemplate {
    constructor(message = null, data = null) {
        super();
        this.name = "NotUniqueError";
        this.message = message !== null ? message : "Valor enviado não é único.";
        this.data = data;
    }
};

class InvalidSessionError extends ErrorTemplate {
    constructor(message = null, data = null) {
        super();
        this.name = "InvalidSessionError";
        this.message = message !== null ? message : "Sessão de usuário inválida.";
        this.data = data;
    }
}
/**
 * Receives a result that can be an error, and the response object from express routes. If there is an error, sets the proper status code to the response, and returns false. If there is not an error, returns true.
 * @param {*} result 
 * @param {*} response 
 * @returns 
 */
async function isResponseValid(result, response) {
    let statusCode;
    let isValid = false;

    switch (true) {
        case result instanceof NullInputError:
            statusCode = StatusCodes.BAD_REQUEST;
            break;
        case result instanceof InvalidCredentialsError:
            statusCode = StatusCodes.FORBIDDEN;
            break;
        case result instanceof InvalidIdentifierError:
            statusCode = StatusCodes.BAD_REQUEST;
            break;
        case result instanceof NotUniqueError:
            statusCode = StatusCodes.CONFLICT;
            break;
        case !(result instanceof ErrorTemplate):
            isValid = true;
            break;
        default:
            statusCode = StatusCodes.IM_A_TEAPOT;
            break;
    }

    if (statusCode != null)
        response.status(statusCode);

    return isValid;
}

module.exports = { InvalidCredentialsError,
                NullInputError,
                InvalidIdentifierError,
                NotUniqueError,
                InvalidSessionError,
                isResponseValid }