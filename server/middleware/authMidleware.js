const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaConfig');

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

// // Auth middleware 
// const authenticate = async (req, res, next) => {
//   // authentication logic here
//   // For now, using a test user ID
//   req.user = { id: 'test-user-id' }; // Replace with actual auth
//   next();
// };


// to be updated after auth
const authenticate = async (req, res, next) => {
  try {
    // For testing, use a fixed user ID
    // In production, you would verify JWT tokens here
    const testUserId = 'test-user-id';
    
    // Ensure test user exists
    let user = await prisma.user.findUnique({
      where: { id: testUserId }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: testUserId,
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashed-password-placeholder'
        }
      });
      logger.info(`Created test user: ${user.id}`);
    }
    
    req.user = { id: testUserId };
    next();
  } catch (error) {
    logger.error(`Auth error: ${error.message}`);
    res.status(401).json({ success: false, error: 'Authentication failed' });
  }
};


module.exports = { protect, restrictTo,authenticate };
