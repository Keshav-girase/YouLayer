const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes')
const googleAuthRoutes = require('./routes/googleAuthRoutes')
const videoRoutes = require('./routes/videoRoutes')
const inviteRoutes = require('./routes/inviteRoutes')
const managerRoutes = require('./routes/managerRoutes')
const creatorRoutes = require('./routes/creatorRoutes')
const presignedUrl = require('./routes/signURLRoutes')
require('dotenv').config();
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");

const app = express();

// Middleware

// Security Headers
app.use(helmet());

// Sanitize user input
app.use(mongoSanitize());
app.use(xss());

// Body parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:4173"],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Set EJS as view engine
app.set('view engine', 'ejs');

// MongoDB Connection
connectDB();

//
app.use('/api/o', googleAuthRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/content/', videoRoutes);

app.use('/api/invite', inviteRoutes);
// url : http://localhost:5000/api/invite/manager


app.use('/api/manager', managerRoutes);

app.use('/api/creator', creatorRoutes);

app.use('/api/presigned-url', presignedUrl);  

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
