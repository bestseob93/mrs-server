'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const app = (0, _express2.default)();
const port = 3000;

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json({ limit: '450mb' }));
app.use((0, _cookieParser2.default)());
app.use(_bodyParser2.default.urlencoded({ limit: '450mb', extended: false, parameterLimit: 1000000 }));

app.use((0, _expressSession2.default)({
    secret: process.env.S_K,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 60, httpOnly: false }
}));

app.use('/', _express2.default.static(_path2.default.join(__dirname, '../public/')));
app.use('/api/v1', _routes2.default);
app.get('*', (req, res) => {
    res.sendFile(_path2.default.join(__dirname, '../../mrs-client/build/'));
});
/* handle error */
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.code === 'LIMIT_FILE_SIZE') {
        console.log('file is too large');
    }
    res.status(500).json({
        error: {
            message: 'Something Broke!',
            code: 0
        }
    });
    next();
});

_mongoose2.default.Promise = global.Promise;
const db = _mongoose2.default.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongod server');
});

// ENABLE DEBUG WHEN DEV ENVIRONMENT
if (process.env.NODE_ENV === 'development') {
    _mongoose2.default.set('debug', true);
    app.use((0, _morgan2.default)('tiny')); // server logger
}

_mongoose2.default.connect(process.env.DB_URL);

const server = _http2.default.createServer(app);
server.listen(port, () => {
    console.log(`Express is running on port ${port}`);
});