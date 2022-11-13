const express = require('express');
const res = require('express/lib/response');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./api/middleware/errorHandler');

const mongoConnection = require('./api/config/db');

// Middleware: CORS
const corsOptions = {
    origin: ['http://localhost:3000'],
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'httponly', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware: Body Parser
app.use(express.json());

// Middleware: Cookie Parser
app.use(cookieParser());

// Initialize DB via mongoose
mongoConnection();

// Define Routes
app.use('/api/users', require('./api/routes/users'));
app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/news', require('./api/routes/news'));
app.use('/api/hanshiAsk', require('./api/routes/hanshiAsk'));
app.use('/api/hanshiReply', require('./api/routes/hanshiReply'));
app.use('/api/exams', require('./api/routes/exams'));
app.use('/api/technique', require('./api/routes/technique'));
app.use('/api/variant', require('./api/routes/variant'));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`app started on port ${PORT}`));
