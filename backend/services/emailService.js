import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(message);
};

export const sendBatchDoneNotification = async (userEmail, tickets) => {
    if (!tickets || tickets.length === 0) return;

    const subject = `Your Ticket(s) are Done!`;
    let ticketListHtml = '<ul>';
    tickets.forEach(ticket => {
        ticketListHtml += `<li><b>${ticket.title}</b>: ${ticket.description}</li>`;
    });
    ticketListHtml += '</ul>';

    const html = `
        <h1>Tickets Completed</h1>
        <p>The following tickets you created have been marked as 'Done':</p>
        ${ticketListHtml}
        <p>You can view them on the dashboard.</p>
    `;

    try {
        await sendEmail({
            email: userEmail,
            subject,
            html
        });
        console.log(`Notification email sent to ${userEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${userEmail}:`, error);
    }
};
