import User from '../models/User.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Please provide name and email' });
        }
        
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        user = await User.create({ name, email });

        // In a real app, you'd return a JWT. Here, we just return the user object.
        res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
