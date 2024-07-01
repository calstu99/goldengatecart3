import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// import NetlifyWelcomeEmail from '@/emails/goldencartWelcome'; // Import the Server Component
import {Email } from '@/emails/welcome';


const resend = new Resend(process.env.RESEND_API_KEY);
// console.log('API Key',process.env.RESEND_API_KEY);
// const resend = new Resend ('re_evdXva8N_jmv8ThYKyw4SLriw2t95fa4r');

export async function POST(request) {


  const { to, subject, text } = await request.json();

  try {
    const emailContent = <Email/>; // Use the Server Component directly
    // const emailContent = <NetlifyWelcomeEmail/>; // Use the Server Component directly

    
    await resend.emails.send({
      // from: 'onboarding@resend.dev',
      from: 'support@goldengatecart.com',
      to:to,
      subject:'Thank you for singing up',
      react: emailContent, // Pass the Server Component as the email content
    });

    console.log('email sent');
    return NextResponse.json({ status: 'Ok' });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}


