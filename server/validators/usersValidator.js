const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// The rules
const userValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    
    body('email')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number'),
    
    body('role')
        .optional()
        .isIn(['ADMIN', 'TECHNICIAN', 'USER']).withMessage('Invalid role assigned')
];

// The middleware that runs the rules
const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    logger.warn({ errors: extractedErrors, path: req.path }, 'Validation failed for new user');

    return res.status(422).json({
        status: 'error',
        message: 'Validation failed',
        errors: extractedErrors,
    });
};

module.exports = {
    userValidationRules,
    validate,
};