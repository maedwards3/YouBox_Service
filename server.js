const express = require('express');
const connectDB = require('./config/db');

// initailize express
const app = express();

// connect to the Database
connectDB();

// initailize the middleware

// def Routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
