// middleware/auth.js
const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaConfig');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');

// Protect middleware - for authenticated routes
const protect = async (req, res, next) => {
    let token;
      if (req.method === 'OPTIONS') {
        return next();
    }
    
    // Check if token exists in Headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database to ensure they still exist
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true
                }
            });

            if (!user) {
                return res.status(401).json({ error: 'User no longer exists' });
            }

            // Add user info to the Request object
            req.user = user;
            next();
        } catch (error) {
            logger.error(`Token verification failed: ${error.message}`);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};

// Optional: For testing/development - bypass auth
const protectDev = async (req, res, next) => {
    //  in development!
    if (process.env.NODE_ENV === 'development') {
        const testUserId = 'test-user-id';
        
        try {
            let user = await prisma.user.findUnique({
                where: { id: testUserId }
            });
            
            if (!user) {
                const hashedPassword = await bcrypt.hash('abc123', 12);
                user = await prisma.user.create({
                    data: {
                        id: testUserId,
                        email: 'test@example.com',
                        name: 'Test User',
                        password: hashedPassword,
                        role: 'ADMIN' 
                    }
                });
                logger.info(`Created test user: ${user.id}`);
            }
            
            req.user = user;
            next();
        } catch (error) {
            logger.error(`Dev auth error: ${error.message}`);
            res.status(401).json({ success: false, error: 'Authentication failed' });
        }
    } else {
        // In production, use real auth
        await protect(req, res, next);
    }
};

// Role-based access control middleware
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Permission Denied: You do not have the required role to perform this action' 
            });
        }
        next();
    };
};

// Export both protect and restrictTo
module.exports = { 
    protect, 
    restrictTo,
    protectDev  // Export dev version if needed
};


