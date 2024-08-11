const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log("auth.js");
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded._id; 
        req.role = decoded.role; 
        next();
    });
};

module.exports = verifyToken;
