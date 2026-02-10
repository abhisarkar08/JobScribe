const user = require('../modules/user.model');
const jwt = require('jsonwebtoken');   

async function authMiddleware(req, res, next) {
    const token = req.cookies.token || '';

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foundUser = await user.findById(decoded.id);

        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        req.user = foundUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = authMiddleware;