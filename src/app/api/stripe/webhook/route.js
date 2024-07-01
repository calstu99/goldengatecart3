

import mongoose from "mongoose";
import connect from "@/app/utils/db";
import MasterOrder from "@/app/models/Master_Order";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const currentDateTime = new Date();

const generateTransactionId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 17; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const extractPaymentDetails = (res,purchasedItems) => {
const name = res?.data?.object?.customer_details?.name;
const email = res?.data?.object?.customer_details?.email;
// const address = res?.data?.object?.customer_details?.address;
const address_base = res?.data?.object?.customer_details?.address;
    const address = [
        {
          line1: address_base.line1,
          line2: address_base.line2 || null,
          city: address_base.city,
          state: address_base.state,
          postal_code: address_base.postal_code,
          country: address_base.country,
        },
      ]; // address  -- convert the address to an array of objects

const sub_total = Number((res?.data?.object?.amount_subtotal / 100).toFixed(2));
const currency = res?.data?.object.currency;
const status = res?.data?.object?.payment_status;
const items = purchasedItems;
const currentTime = currentDateTime.toLocaleTimeString(); // time
const currentDate = currentDateTime.toLocaleDateString(); // date
const paymentMethod = 'Stripe'; // payment Method
const transaction_id = generateTransactionId();

return {name, email,address, items, sub_total, currency, status, currentTime, currentDate, paymentMethod,transaction_id};
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
  address:paymentDetails.address[0],
  items: paymentDetails.items,
  sub_total: paymentDetails.sub_total,
  currency:paymentDetails.currency,
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




export async function POST(req) {
  const payload = await req.text();
  const res = JSON.parse(payload);
  const sig = req.headers.get("Stripe-Signature");

  try {
    let event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // console.log("Event", event?.type);
    // This is where all the magic happens
    
    // Events for Callback in Stripe 
    // charge.succeeded
    // payment_intent.succeeded
    // payment_intent.created
    //checkout.session.completed 

    
     // Handle the event
  switch (event.type) {
    case 'charge.succeeded':
      console.log('charge succeeded triggered');
      // console.log( JSON.stringify(res?.data?.object));
    break;
    case 'checkout.session.completed':
      console.log('checkout.session.completed triggered');
      console.log( 'Stripe checkout session completed', JSON.stringify(res?.data?.object));
      const lineItems = await stripe.checkout.sessions.listLineItems(res?.data?.object?.id);
      console.log('line items',JSON.stringify(lineItems));
      const purchasedItems = lineItems.data.map((item) => ({
        name: item.description,
        quantity: Number(item.quantity),
        unit_price:Number((item.price.unit_amount/100).toFixed(2)),
        amount_total:Number((item.amount_subtotal/100).toFixed(2)),
      }));
      console.log('purchased items', purchasedItems);
      const paymentDetailsCheckout = extractPaymentDetails(res,purchasedItems);
      console.log ('paymentDetails Checkout!!!', paymentDetailsCheckout);
      await savePaymentDetailsToDatabase(paymentDetailsCheckout);
      await sendEmail(paymentDetailsCheckout);
    break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
    return new Response(
      JSON.stringify({ status: "success", event: event.type, response: res }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "Failed", error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
