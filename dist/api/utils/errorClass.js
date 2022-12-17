"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.ClientError = void 0;
class ErrorBase extends Error {
    constructor(message = "Something went wrong!", code, options = {}) {
        super(message);
        this.code = code;
        Object.entries(options).forEach(([key, value]) => {
            this[key] = value;
        });
    }
    get statusCode() {
        return this.code;
    }
}
class ClientError extends ErrorBase {
    constructor(message, code = 400, options) {
        super(message, code, options);
    }
}
exports.ClientError = ClientError;
class ServerError extends ErrorBase {
    constructor(message, code = 500, options) {
        super(message, code, options);
    }
}
exports.ServerError = ServerError;
