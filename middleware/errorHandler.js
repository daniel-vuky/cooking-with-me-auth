const listError = {
    validation_error: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    internal_server_error: 500,
};

const errorHandler = (err, req, res, next) => {
    if (!err) {
        return;
    }
    const statusCode = res.statusCode ? res.statusCode : listError.internal_server_error;
    switch(statusCode) {
        case listError.validation_error:
            res.json({
                title: "Validation failure!",
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case listError.unauthorized:
            res.json({
                title: "Unauthorized",
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case listError.forbidden:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case listError.not_found:
            res.json({
                title: "Not found",
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case listError.internal_server_error:
            res.json({
                title: "Server error",
                message: err.message,
                stackTrace: err.stack
            });
            break;
        default:
            res.json({
                title: "An internal server error happened!",
                message: err.message,
                stackTrace: err.stack
            });
            break;
    }
}

module.exports = errorHandler;
