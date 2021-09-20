const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const create_router = require('./routes/index');
const create_usages_limiter = require('./usage-limiter');

function create_app({db, time_window, provider, UPLOAD_LIMIT, DOWNLOAD_LIMIT}) {
    const app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    const upload_limiter = create_usages_limiter({
        time_window, request_limit: UPLOAD_LIMIT, db, name: 'upload'
    });

    const download_limiter = create_usages_limiter({
        time_window, request_limit: DOWNLOAD_LIMIT, db, name: 'download'
    });

    app.use('/', create_router({provider, upload_limiter, download_limiter}));


    return app;
}


module.exports = create_app;
