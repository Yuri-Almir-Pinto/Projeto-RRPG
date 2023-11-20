const { UniqueConstraintError } = require("sequelize");

class ErrorTemplate {
    constructor(message = null, data = "") {
        this.name;
        this.message = message || "";
        this.data = data;
        this.stack = new Error().stack;
    }

    toJson() {
        return {
            error: {
                name: this.name,
                message: this.message,
                data: this.data,
            }
        }
    }
}

class NullInputError extends ErrorTemplate {
    constructor(message = null, data = null) {
        super(message, data);
        this.name = "NullInputError";
        this.message = "Valor enviado é nulo."
    };
};

class InvalidCredentialsError extends ErrorTemplate{
    constructor(message = null, data = null) {
        super(message, data);
        this.name = "InvalidCredentialsError";
        this.message = "Credenciais enviadas são inválidas."
    }
};

class InvalidIdentifierError extends ErrorTemplate{
    constructor(message = null, data = null) {
        super(message, data)
        this.name = "InvalidIdentifierError";
        this.message = "Identificador enviado é inválido."
    }
    
};

class NotUniqueError extends ErrorTemplate{
    constructor(message = null, data = null) {
        super(message, data);
        this.name = "NotUniqueError";
        this.name = "Valor enviado não é único."
    }
};

module.exports.InvalidCredentialsError = InvalidCredentialsError;
module.exports.NullInputError = NullInputError;
module.exports.InvalidIdentifierError = InvalidIdentifierError;
module.exports.NotUniqueError = NotUniqueError;