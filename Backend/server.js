require('dotenv').config();
const express = require('express');
const app = require('./src/app');
const connectDB = require('./src/db/db');
const authRoutes = require('./src/routes/auth.routes');
const cookieParser = require('cookie-parser');

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});