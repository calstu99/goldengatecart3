import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {SlackConfirmEmail} from '@/emails/goldengate-confirm'; // Import the Server Component


const resend = new Resend(process.env.RESEND_API_KEY);
// console.log('API Key',process.env.RESEND_API_KEY);
// const resend = new Resend ('re_evdXva8N_jmv8ThYKyw4SLriw2t95fa4r');

export async function GET(request) {


  // const { to, subject, text } = await request.json();

  try {
    // const emailContent = <Email/>; // Use the Server Component directly
    const emailContent = <SlackConfirmEmail/>; // Use the Server Component directly

    
    await resend.emails.send({
      // from: 'onboarding@resend.dev',
      from: 'support@goldengatecart.com',
      to:'haenergycapital@gmail.com',
      subject:'Thanks for singing up again_Golden_confirm',
      react: emailContent, // Pass the Server Component as the email content
    });

    return NextResponse.json({ status: 'Ok' });

    console.log('email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}