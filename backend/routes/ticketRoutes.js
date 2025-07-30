import express from 'express';
import {
    getAllTickets,
    getUserTickets,
    createTicket,
    getTicketById,
    updateTicket,
    deleteTicket,
    updateStatus,
    getTicketHistory,
    bulkStatusUpdate
} from '../controllers/ticketController.js';
import { validateTicketCreation, validateStatusUpdate } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
    .get(getAllTickets)
    .post(validateTicketCreation, createTicket);

router.route('/user/:userId')
    .get(getUserTickets);

router.route('/bulk-status')
    .post(bulkStatusUpdate);
    
router.route('/:id')
    .get(getTicketById)
    .put(updateTicket)
    .delete(deleteTicket);
    
router.route('/:id/status')
    .patch(validateStatusUpdate, updateStatus);

router.route('/:id/history')
    .get(getTicketHistory);

export default router;
