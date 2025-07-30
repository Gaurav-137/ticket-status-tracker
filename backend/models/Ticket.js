import mongoose from 'mongoose';

const StatusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Review', 'Testing', 'Done'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    status: {
        type: String,
        required: true,
        enum: ['Open', 'In Progress', 'Review', 'Testing', 'Done'],
        default: 'Open'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    history: [StatusHistorySchema]
}, { timestamps: true }); // createdAt and updatedAt

export default mongoose.model('Ticket', TicketSchema);
