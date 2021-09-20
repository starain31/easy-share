function usages_limiter({time_window, request_limit, db, name}) {
    return async function (req, res, next) {
        const key = `${name}:${req.ip}`;
        const total_request = await db.increment_daily_request({key, time_window});
        if(request_limit < total_request) {
            return res.status(429).send({message: 'Too Many Requests'});
        }
        next();
    }
}

module.exports = usages_limiter;
