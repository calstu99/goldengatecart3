import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {WelcomeEmail } from '@/emails/welcome';


const resend = new Resend(process.env.RESEND_API_KEY);
// console.log('API Key',process.env.RESEND_API_KEY);
// const resend = new Resend ('re_evdXva8N_jmv8ThYKyw4SLriw2t95fa4r');

export async function POST(request) {


  const {to} = await request.json();

  try {
    const emailContent = <WelcomeEmail/>; // Use the Server Component directly
    
    await resend.emails.send({
      // from: 'onboarding@resend.dev',
      // from: 'support@goldengatecart.com',
      from:process.env.EMAIL_ADDRESS,
      to:to,
      cc: process.env.CC_EMAIL_ADDRESSES ? process.env.CC_EMAIL_ADDRESSES.split(',') : [],
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


