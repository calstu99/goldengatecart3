import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import ResetPasswordEmail  from '@/emails/resetpassword'; // Import the Server Component

const resend = new Resend(process.env.RESEND_API_KEY);
const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;

export async function POST(request) {
  const { userFirstname, resetPasswordLink} = await request.json();

  try {
    const emailContent = (
      <ResetPasswordEmail 
      userFirstname={userFirstname}
      resetPasswordLink={resetPasswordLink}
      />
    );

    await resend.emails.send({
      from: process.env.EMAIL_ADDRESS,
      to: 'haenergycapital@gmail.com',
      subject: `${websiteName} Password Reset`,
      react: emailContent,
    });

    console.log('Notification email sent');
    return NextResponse.json({ status: 'Ok' });
  } catch (error) {
    console.error('Error sending notification email:', error);
    return NextResponse.json({ error: 'Failed to send notification email' }, { status: 500 });
  }
}