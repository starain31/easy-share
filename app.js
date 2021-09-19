const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const create_router = require('./routes/index');
const create_provider = require('./storage_provider');

function create_app({db}) {
    const app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    const provider = create_provider({provider: process.env.PROVIDER, db});
    app.use('/', create_router({provider}));

    return app;
}


module.exports = create_app;
