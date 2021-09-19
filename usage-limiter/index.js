function usage_limiter({time_window, request_limit, db}) {
    return function (req, res, next) {
        console.log({time_window, request_limit, db});
        next();
    }
}

module.exports = usage_limiter;
