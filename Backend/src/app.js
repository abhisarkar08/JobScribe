const express = require('express');
const cookies = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookies());

module.exports = app;