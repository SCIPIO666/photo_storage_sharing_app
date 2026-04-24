const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;

    // Check if token exists in Headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user info from token to the Request object
            req.user = decoded; 

            next(); // Let them through!
        } catch (error) {
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};
//returns a middleware
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user was set by the 'protect' middleware above
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Permission Denied: You do not have the required role to perform this action' 
            });
        }
        next();
    };
};

module.exports = { protect, restrictTo };
