import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

/**
 * Get all tickets with pagination
 * @desc    Get all tickets with pagination
 * @route   GET /api/tickets
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.page - Page number (default: 1)
 * @param {number} req.query.limit - Items per page (default: 10)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with paginated tickets
 */
export const getAllTickets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const tickets = await Ticket.find()
            .populate('owner', 'name email')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Ticket.countDocuments();
        
        res.status(200).json({ 
            success: true, 
            data: tickets,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all tickets for a user
// @route   GET /api/tickets/user/:userId
export const getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ owner: req.params.userId }).populate('owner', 'name email').sort({ updatedAt: -1 });
        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create a new ticket
 * @desc    Create new ticket
 * @route   POST /api/tickets
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.title - Ticket title (max 100 chars)
 * @param {string} req.body.description - Ticket description
 * @param {string} req.body.ownerId - ID of ticket owner
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with created ticket
 */
export const createTicket = async (req, res) => {
    try {
        const { title, description, ownerId } = req.body;
        const owner = await User.findById(ownerId);
        if (!owner) {
             return res.status(404).json({ success: false, message: 'Owner user not found' });
        }
        
        let ticket = await Ticket.create({
            title,
            description,
            owner: ownerId,
            history: [{ status: 'Open', timestamp: new Date() }]
        });

        // Repopulate the owner field before sending back to frontend
        ticket = await ticket.populate('owner', 'name email');

        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('owner', 'name email');
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }
        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update ticket details
// @route   PUT /api/tickets/:id
export const updateTicket = async (req, res) => {
    try {
        let ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }
        
        // Repopulate the owner field before sending back to frontend
        ticket = await ticket.populate('owner', 'name email');

        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update ticket status
// @route   PATCH /api/tickets/:id/status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        ticket.status = status;
        ticket.history.push({ status: status, timestamp: new Date() });
        await ticket.save();

        // Repopulate the owner field before sending back to frontend
        await ticket.populate('owner', 'name email');

        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
export const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }
        
        await ticket.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get ticket history
// @route   GET /api/tickets/:id/history
export const getTicketHistory = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).select('history');
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }
        res.status(200).json({ success: true, data: ticket.history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Bulk status update
// @route   POST /api/tickets/bulk-status
export const bulkStatusUpdate = async (req, res) => {
    try {
        const { ticketIds, status } = req.body;
        
        if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide valid ticket IDs' });
        }
        
        if (!status) {
            return res.status(400).json({ success: false, message: 'Please provide status' });
        }

        const updatePromises = ticketIds.map(async (ticketId) => {
            const ticket = await Ticket.findById(ticketId);
            if (ticket) {
                ticket.status = status;
                ticket.history.push({ status: status, timestamp: new Date() });
                return ticket.save();
            }
            return null;
        });

        const results = await Promise.all(updatePromises);
        const updatedTickets = results.filter(ticket => ticket !== null);

        res.status(200).json({ 
            success: true, 
            message: `Updated ${updatedTickets.length} tickets`,
            data: updatedTickets 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};