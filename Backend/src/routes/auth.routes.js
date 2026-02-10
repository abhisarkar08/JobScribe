const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authcontroller.register);
router.post('/login', authMiddleware, authcontroller.login);
router.post('/logout', authMiddleware, authcontroller.logout);
router.get('/profile', authMiddleware, authcontroller.profile);

module.exports = router;