const express = require('express');
const connectDB = require('./config/db');

// initailize express
const app = express();

// connect to the Database
connectDB();

// initailize the middleware
app.use(express.json({ extended: false }));

// def Routes
app.use('/api/users', require('./route/api/users'));
app.use('/api/login', require('./route/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
