import User from '../models/User.js';

/**
 * Register a new user
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with user data or error
 */
export const register = async (req, res) => {
    try {
        console.log('Registration attempt:', req.body);
        const { name, email } = req.body;
        
        if (!name || !email) {
            console.log('Missing name or email');
            return res.status(400).json({ success: false, message: 'Please provide name and email' });
        }
        
        console.log('Checking if user exists:', email);
        let user = await User.findOne({ email });

        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        console.log('Creating new user:', { name, email });
        user = await User.create({ name, email });
        console.log('User created successfully:', user._id);

        res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        res.status(500).json({ success: false, message: 'Database connection error. Please ensure MongoDB is running.' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email' });
        }
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found. Please register first.' });
        }

        res.status(200).json({ success: true, data: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Database connection error. Please ensure MongoDB is running.' });
    }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
