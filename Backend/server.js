require('dotenv').config();
const express = require('express');
const app = require('./src/app');
const connectDB = require('./src/db/db');
const authRoutes = require('./src/routes/auth.routes');
const cookieParser = require('cookie-parser');
const resumeRoutes = require('./src/routes/resume.routes');

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});