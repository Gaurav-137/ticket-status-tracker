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

const router = express.Router();

router.route('/')
    .get(getAllTickets)
    .post(createTicket);

router.route('/user/:userId')
    .get(getUserTickets);

router.route('/bulk-status')
    .post(bulkStatusUpdate);
    
router.route('/:id')
    .get(getTicketById)
    .put(updateTicket)
    .delete(deleteTicket);
    
router.route('/:id/status')
    .patch(updateStatus);

router.route('/:id/history')
    .get(getTicketHistory);

export default router;
