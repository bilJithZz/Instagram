const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // Extract the Authorization header
    const authHeader = req.header('Authorization');

    console.log('Authorization Header:', authHeader);

    // Extract the token from the header
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    console.log('Extracted Token:', token);

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user information to request object
        req.user = decoded;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired." });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: "Invalid token." });
        } else {
            return res.status(400).json({ message: "Token verification failed." });
        }
    }
};

module.exports = authMiddleware;
