require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./db/db');

connectDB();

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});