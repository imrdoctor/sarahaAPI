export const asyncHndelar = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            if (!res.headersSent) {
                next(error); 
            }
        });
    };
};



export const globalErrorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error); 
    }

    const response = {
        msg: "Error",
        message: error.message,
    };

    if (error.cause?.errors) {
        response.errors = error.cause.errors;
    }
    res.status(error.cause?.status || 500).json(response);
};

