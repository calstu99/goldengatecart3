import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import NotificationEmail from '@/emails/notification'; // Import the Server Component

const resend = new Resend(process.env.RESEND_API_KEY);
const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;

export async function POST(request) {
  const { to, username, content } = await request.json();

  try {
    const emailContent = (
      <NotificationEmail 
        username={username}
        content={content}
      />
    );

    await resend.emails.send({
      from: process.env.EMAIL_ADDRESS,
      to: to,
      subject: `${websiteName} Update Email`,
      react: emailContent,
    });

    console.log('Notification email sent');
    return NextResponse.json({ status: 'Ok' });
  } catch (error) {
    console.error('Error sending notification email:', error);
    return NextResponse.json({ error: 'Failed to send notification email' }, { status: 500 });
  }
}