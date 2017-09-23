import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';

import mongoose from 'mongoose';

import api from './routes';

const app = express();
const port = 80;

app.use(cors());
app.use(bodyParser.json({limit: '450mb'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '450mb', extended: false, parameterLimit: 1000000 }));

app.use(session({
    secret: process.env.S_K,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000*60, httpOnly: false }
}));


app.use('/', express.static(path.join(__dirname, '../public/')));
app.use('/api/v1', api);
app.get('*', (req, res) => {
				res.sendFile(path.join(__dirname, '../public/'))
});
/* handle error */
app.use((err, req, res, next) => {
    console.error(err.stack);
    if(err.code === 'LIMIT_FILE_SIZE') {
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

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongod server');
});


// ENABLE DEBUG WHEN DEV ENVIRONMENT
if(process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
    app.use(morgan('tiny')); // server logger
}


mongoose.connect(process.env.DB_URL);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Express is running on port ${port}`);
});
