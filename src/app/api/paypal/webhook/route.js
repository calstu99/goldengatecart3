
import { NextResponse } from 'next/server';
// import { verifyWebhookSignature } from '@paypal/checkout-server-idn';
// need to apply header verfication from Paypal
// https://developer.paypal.com/api/rest/webhooks/rest/
import AppleReceiptEmail from '@/emails/goldengate-receipt'; // Import the Server Component


import mongoose from "mongoose";
import connect from "@/app/utils/db";
import MasterOrder from "@/app/models/Master_Order";


// Payment Details to capture from transaction
/* 
Name, email, address,items, total, currency, status, time, date
*/

const currentDateTime = new Date();

const extractPaymentDetails = (res) => {

    const name = res?.resource?.purchase_units[0].shipping.name.full_name; // name
    const email = res?.resource?.purchase_units[0].payee.email_address; // email
    // const address = JSON.stringify(res?.resource?.purchase_units[0].shipping.address); // address

    const address_base = res?.resource?.purchase_units[0].shipping.address;
    const address = [
        {
          line1: address_base.address_line_1,
          line2: address_base.address_line_2 || null,
          city: address_base.admin_area_2,
          state: address_base.admin_area_1,
          postal_code: address_base.postal_code,
          country: address_base.country_code,
        },
      ]; // address  -- convert the address to an array of objects
    // const items = JSON.stringify(res?.resource?.purchase_units[0].items); // items
    const items = res?.resource?.purchase_units[0].items.map(item => ({
        name: item.name,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_amount.value),
        amount_total: Number(item.unit_amount.value * item.quantity),
      })); // items  -- convert the items to an array of objects
    const sub_total = Number(res?.resource?.purchase_units[0].amount.value); // total
    const currency = JSON.stringify(res?.resource?.purchase_units[0].amount.currency_code); // currency
    const status = res?.resource?.status; // status
    const transaction_id = res?.resource?.id // transaction id
    const currentTime = currentDateTime.toLocaleTimeString(); // time
    const currentDate = currentDateTime.toLocaleDateString(); // date
    const paymentMethod = 'Paypal'; // payment Method
    
    return {name,email,address,items,sub_total,currency,status, currentTime, currentDate,paymentMethod, transaction_id};
  }
  
// Function to save data to the database
const saveDataToDatabase = async (data) => {
    try {
      await connect();
      const newData = new MasterOrder(data);
      const savedData = await newData.save();
      console.log('Data saved:', savedData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  const savePaymentDetailsToDatabase = async (paymentDetails) => {
    // Code to save paymentDetails to the database
    // ...
    // const dataToStore = { name: 'John Doe', email: 'john@example.com' };
//   await saveDataToDatabase(paymentDetails);

const dataToStore = 
{
    name : paymentDetails.name,
    email: paymentDetails.email,
    // address: {
    //   city: 'Sacramento',
    //   country: 'USA',
    //   line1: '4 Park Lane',
    //   line2: '',
    //   postal_code: '95842',
    //   state: 'CA',
    // },
    address:paymentDetails.address[0],
    // items: [
    //   {
    //       name: 'ladies handbag',
    //       quantity: 2,
    //       unit_price: 15.99,
    //       amount_total:32.22,
    //   },
    //   {
    //       name: 'CRKT Knife',
    //       quantity: 3,
    //       unit_price: 15.99,
    //       amount_total:82.22,
    //   },
    // ],
    items: paymentDetails.items,
    // sub_total: parseFloat(paymentDetails.sub_total), // or sub_total: Number(paymentDetails.sub_total),
    sub_total: Number(paymentDetails.sub_total),
    currency:paymentDetails.currency,
    // shippingAddress: {
    //   street: '11 Peters Lane',
    //   city: 'Sacramento',
    //   state: '4 Park Lane',
    //   postal_code: '95842',
    //   country: 'USA',
    // },
    shippingAddress: paymentDetails.address[0],
    paymentMethod: {
      platform: paymentDetails.paymentMethod,
      cardType: '',
      cardNumber: '',
      expiryDate: '',
      cardHolderName: '',
    },
    status:paymentDetails.status,
    currentTime: paymentDetails.currentTime,
    currentDate: paymentDetails.currentDate,
    transaction_id:paymentDetails.transaction_id,
  };

  await saveDataToDatabase(dataToStore);

    console.log('saving purchase to database');
    console.log('saving payment subtotal',paymentDetails.sub_total);
  };


  // Function to email receipt
  const sendEmail = async(paymentDetails) => {
    const to = 'haenergycapital@gmail.com';
    const subject = 'Thank you for your order';
    const text = 'This is a test order';
    const total = paymentDetails.sub_total;
    const name = paymentDetails.name;
    const email = paymentDetails.email;
    const items = paymentDetails.items;
    const shipping_address =  paymentDetails.address[0];
    const orderDate = paymentDetails.currentDate;
    const transaction_id = paymentDetails.transaction_id;
  
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiBaseUrl}/api/email/receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, text, total, name, email,items,shipping_address, orderDate,transaction_id}),
      });
  
      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };


export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('paypal-transmission-id');
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    // const isVerified = await verifyWebhookSignature(body, signature, webhookId);
    // if (!isVerified) {
    //   return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    // }

    const event = JSON.parse(body);
    // console.log('event',event);
    // console.log('event',JSON.stringify(event));

    // Handle the event based on its type
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptureCompleted(event);
        // console.log( event);
        break;
      case 'CHECKOUT.ORDER.APPROVED':
        await handlePaymentCaptureCompleted(event);
        const paymentDetailsCheckout = extractPaymentDetails(event);
        console.log ('paymentDetails!!!',paymentDetailsCheckout);
        await savePaymentDetailsToDatabase(paymentDetailsCheckout);
        // console.log( 'event resource',JSON.stringify(event.resource));  // prints data returned from webhook.
        
        // send email
        const totalP = 99.99;  // just placeholder
        await sendEmail(paymentDetailsCheckout);

        break;
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentCaptureDenied(event);
        // console.log( event);
        break;
      // Handle other event types as needed
      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling PayPal webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePaymentCaptureCompleted(event) {
  // Handle the PAYMENT.CAPTURE.COMPLETED event
  // e.g., update order status, send notification, etc.
//   console.log('Payment captured:', event.resource);
}

async function handlePaymentCaptureDenied(event) {
  // Handle the PAYMENT.CAPTURE.DENIED event
  // e.g., update order status, send notification, etc.
//   console.log('Payment capture denied:', event.resource);
}

