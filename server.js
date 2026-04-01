const express = require('express');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config({
    path: path.resolve(__dirname, './.env'),
});
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const mongoSanitize = require('express-mongo-sanitize');

const mongoConnection = require('./config/db');

// disable console.log except in development environment
if (!process.env.NODE_ENVIRONMENT == 'development') {
    console.log = () => {};
}

// Middleware: CORS
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://portal.chudokaiaikidofederationinternational.org',
        'https://benevolent-melomakarona-b9b612.netlify.app/',
    ],
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'httponly', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware: Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Middleware: Rate limiting (general)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, message: 'Too many requests, please try again later.' },
}));

// Middleware: Body Parser
app.use(express.json());

// Middleware: Cookie Parser
app.use(cookieParser());

// Initialize DB via mongoose
mongoConnection();

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/hanshiAsk', require('./routes/hanshiAsk'));
app.use('/api/hanshiReply', require('./routes/hanshiReply'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/technique', require('./routes/technique'));
app.use('/api/variant', require('./routes/variant'));
app.use('/api/kotoshitsumon', require('./routes/kotoShitsumon'));
app.use('/api/danShiteWaza', require('./routes/danShiteWaza'));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`app started on port ${PORT}`));
