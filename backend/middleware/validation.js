/**
 * Input validation middleware for API requests
 * @module middleware/validation
 */

/**
 * Validate user registration data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const validateUserRegistration = (req, res, next) => {
    const { name, email } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Please provide a valid email address');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

/**
 * Validate ticket creation data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const validateTicketCreation = (req, res, next) => {
    const { title, description, ownerId } = req.body;
    const errors = [];

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push('Title is required');
    } else if (title.length > 100) {
        errors.push('Title cannot exceed 100 characters');
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.push('Description is required');
    }

    if (!ownerId || typeof ownerId !== 'string') {
        errors.push('Owner ID is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

/**
 * Validate ticket status update
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const validateStatusUpdate = (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];

    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Status must be one of: ${validStatuses.join(', ')}`
        });
    }

    next();
};