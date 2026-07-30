import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/contact/send-email', async (req, res) => {
    const { firstName, lastName, email, description } = req.body;

    if (!firstName || !lastName || !email || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Website Form" <${process.env.EMAIL_USER}>`, // The authenticated sender
            to: process.env.EMAIL_USER, // Check where they want to receive it, usually themselves
            replyTo: email, // Reply to the user who filled the form
            subject: `New Contact Form Submission from ${firstName} ${lastName}`,
            text: `
                Name: ${firstName} ${lastName}
                Email: ${email}
                
                Message:
                ${description}
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });

    } catch (error) {
        console.error("Email send error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

export default router;
