import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import AppleReceiptEmail from '@/emails/goldengate-receipt'; // Import the Server Component


const resend = new Resend(process.env.RESEND_API_KEY);
// console.log('API Key',process.env.RESEND_API_KEY);
// const resend = new Resend ('re_evdXva8N_jmv8ThYKyw4SLriw2t95fa4r');
const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;

export async function POST(request) {


  // const { to, subject, text, total} = await request.json();

  const { 
    to, 
    subject, 
    text, 
    total, 
    name, 
    email, 
    items, 
    shipping_address,
    currency,
    status,
    orderDate,
    orderTime,
    paymentMethod,
    transaction_id,
  } = await request.json();

  try {
    // const emailContent = <Email/>; // Use the Server Component directly
    // const emailContent = <AppleReceiptEmail total = {total}/>; // Use the Server Component directly
    const emailContent = (
      <AppleReceiptEmail 
        total={total}
        name={name}
        email={email}
        items={items}
        shipping_address={shipping_address}
        currency={currency}
        status={status}
        orderDate={orderDate}
        orderTime={orderTime}
        paymentMethod={paymentMethod}
        transaction_id ={transaction_id}
      />
    );

       // Send a copy to the store owner
    await resend.emails.send({
      // from: 'onboarding@resend.dev',
      // from: 'Golden Gate Cart <support@goldengatecart.com>',
      from: process.env.EMAIL_ADDRESS,
      to:'haenergycapital@gmail.com',// change to email
      // cc:'howard.beckford@gmail.com',
      // subject: 'New Order Received',
      subject: `${websiteName} Order Confirmation #${transaction_id}`,
      react: emailContent, // Pass the Server Component as the email content
    });

        // method to send email for purchase
        // await resend.emails.send({
        //   from: 'support@goldengatecart.com',
        //   to: email, // Send to the customer's email
        //   subject: 'Thanks for your purchase',
        //   react: emailContent,
        // });
    
      
    console.log('email sent');
    return NextResponse.json({ status: 'Ok' });

    
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}