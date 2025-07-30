import cron from 'node-cron';
import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { sendBatchDoneNotification } from '../services/emailService.js';

const STATUS_WORKFLOW = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];
const STATUS_PROGRESSION_TIMES_MS = {
  'Open': 2 * 60 * 1000,        // 2 minutes
  'In Progress': 2 * 60 * 1000, // 2 minutes
  'Review': 2 * 60 * 1000,      // 2 minutes
  'Testing': 2 * 60 * 1000,     // 2 minutes
};

const checkAndProgressTickets = async () => {
    console.log('Running ticket progression job...');
    const now = new Date();
    
    // Find tickets that are not in the final state
    const ticketsToProgress = await Ticket.find({
        status: { $in: Object.keys(STATUS_PROGRESSION_TIMES_MS) }
    }).populate('owner', 'email');

    const completedTicketsByUser = new Map();

    for (const ticket of ticketsToProgress) {
        const currentStatus = ticket.status;
        const timeToWait = STATUS_PROGRESSION_TIMES_MS[currentStatus];
        
        if (timeToWait && (now - ticket.updatedAt > timeToWait)) {
            const currentStatusIndex = STATUS_WORKFLOW.indexOf(currentStatus);
            const nextStatus = STATUS_WORKFLOW[currentStatusIndex + 1];

            if (nextStatus) {
                console.log(`Progressing ticket ${ticket._id} from ${currentStatus} to ${nextStatus}`);
ticket.status = nextStatus;
ticket.history.push({ status: nextStatus, timestamp: new Date() });
await ticket.save();

                if (nextStatus === 'Done' && ticket.owner) {
                    const userEmail = ticket.owner.email;
                    if (!completedTicketsByUser.has(userEmail)) {
                        completedTicketsByUser.set(userEmail, []);
                    }
                    completedTicketsByUser.get(userEmail).push(ticket);
                }
            }
        }
    }
    
    // Send batched emails
    for (const [email, tickets] of completedTicketsByUser.entries()) {
        await sendBatchDoneNotification(email, tickets);
    }
};

// Schedule to run every minute
const job = cron.schedule('* * * * *', checkAndProgressTickets, {
    scheduled: false // Do not start automatically
});

export default job;
