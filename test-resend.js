import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
    console.log('Testing Resend with key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'ebrahimkordy0@gmail.com',
            subject: 'Test Email from Portfolio',
            html: '<p>If you see this, Resend is working!</p>',
        });
        console.log('Success:', data);
    } catch (error) {
        console.error('Error Object:', JSON.stringify(error, null, 2));
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Body:', error.response.body);
        }
    }
}

test();
