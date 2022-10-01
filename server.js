const express = require('express');
const res = require('express/lib/response');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoConnection = require('./api/config/db');

// Middleware: CORS
const corsOptions = {
    origin: ['http://localhost:3000'],
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
app.use('/api/askHanshi', require('./api/routes/askHanshi'));
app.use('/api/exams', require('./api/routes/exams'));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`app started on port ${PORT}`));
