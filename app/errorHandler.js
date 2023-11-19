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
    };
};

class InvalidCredentialsError extends ErrorTemplate{
    constructor(message = null, data = null) {
        super(message, data);
        this.name = "InvalidCredentialsError";
    }
};

class InvalidIdentifierError extends ErrorTemplate{
    constructor(message = null, data = null) {
        super(message, data)
        this.name = "InvalidIdentifierError";
    }
    
};

class NotUniqueError extends ErrorTemplate{
    constructor(message = null, data = null) {
        super(message, data);
        this.name = "NotUniqueError";
    }
};

module.exports.InvalidCredentialsError = InvalidCredentialsError;
module.exports.NullInputError = NullInputError;
module.exports.InvalidIdentifierError = InvalidIdentifierError;
module.exports.NotUniqueError = NotUniqueError;