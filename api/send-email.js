import { Resend } from 'resend';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('[API] Processing email sending request');

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.error('[API] Missing required fields:', { name: !!name, email: !!email, message: !!message });
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not configured in environment variables');
        }

        const resend = new Resend(apiKey);
        console.log('[API] Resend initialized, sending email...');

        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ['ebrahimkordy0@gmail.com'],
            subject: `New Message from ${name}`,
            reply_to: email,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        });

        console.log('[API] Email sent successfully:', data);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('[API] Error sending email:', error);
        if (error.response) {
            console.error('[API] Resend Error Details:', error.response.body || error.response.data);
        }
        return res.status(500).json({
            error: 'Failed to send email',
            message: error.message,
            details: error.response?.body || error.response?.data || null
        });
    }
}
