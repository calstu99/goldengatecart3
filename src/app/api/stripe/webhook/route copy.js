const stripe = require("stripe")(process.env.STRIPE_SECRET);


// Payment Details to capture from transaction
/* 
Name, email, address,items, total, currency, status, time, date
*/

const currentDateTime = new Date();
// const extractPaymentDetails = (res) => {
//   const transaction_id = res?.data?.object?.id; // transaction_id
//   const name = res?.data?.object?.billing_details?.name; // name
//   const email = res?.data?.object?.billing_details?.email; // email
//   const address = res?.data?.object?.billing_details?.address; // address
//   // const phone = res?.data?.object?.billing_details?.phone; // phone
//   const total = (res?.data?.object?.amount / 100).toFixed(2); // total
//   // const refunded = res?.data?.object?.amount_refunded; // amount refunded
//   const currency = res?.data?.object?.currency // currency
//   const receipt_url = res?.data?.object?.receipt_url // receipt url
//   const status = res?.data?.object?.paid // status
//   const currentTime = currentDateTime.toLocaleTimeString(); // time
//   const currentDate = currentDateTime.toLocaleDateString(); // date
//   const paymentMethod = 'Stripe'; // payment Method

//   return {name, email, address, total, currency, status, receipt_url, currentTime, currentDate, paymentMethod};
// }

const extractPaymentDetails = (res) => {
  //const transaction_id = res?.data?.object?.id; // transaction_id
  //const name = res?.data?.object?.billing_details?.name; // name
  //const email = res?.data?.object?.billing_details?.email; // email
  //const address = res?.data?.object?.billing_details?.address; // address
  // const phone = res?.data?.object?.billing_details?.phone; // phone
  //const total = (res?.data?.object?.amount / 100).toFixed(2); // total
  // const refunded = res?.data?.object?.amount_refunded; // amount refunded
  //const currency = res?.data?.object?.currency // currency
  //const receipt_url = res?.data?.object?.receipt_url // receipt url
  //const status = res?.data?.object?.paid // status
  const lineItems = stripe.checkout.sessions.listLineItems(res?.data?.object?.id);
  const currentTime = currentDateTime.toLocaleTimeString(); // time
  const currentDate = currentDateTime.toLocaleDateString(); // date
  const paymentMethod = 'Stripe'; // payment Method
  return (lineItems,currentTime,currentDate, paymentMethod);

  // return {name, email, address, total, currency, status, receipt_url, currentTime, currentDate, paymentMethod};
}
export async function POST(req) {
  const payload = await req.text();
  const res = JSON.parse(payload);
  const sig = req.headers.get("Stripe-Signature");

  // const dateTime = new Date(res?.created * 1000).toLocaleDateString();
  // const timeString = new Date(res?.created * 1000).toLocaleDateString();

  try {
    let event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Event", event?.type);
    // This is where all the magic happens
    
    // charge.succeeded
    // payment_intent.succeeded
    // payment_intent.created

    //checkout.session.completed ***

     // Handle the event

  switch (event.type) {
    case 'charge.succeeded':
    // const paymentDetails = extractPaymentDetails(res);
    // console.log ('paymentDetails!!!',paymentDetails);
    // console.log( JSON.stringify(res?.data?.object));
    break;
    case 'checkout.session.completed':
      // console.log( 'checkout session completed', JSON.stringify(res?.data?.object));
      // const lineItems = event.data.object.line_items;
      // const purchasedItems = lineItems.data.map((item) => ({
      //   name: item.description,
      //   quantity: item.quantity,
      //   price: item.price.unit_amount,
      // }));

      // console.log("Purchased Items:", purchasedItems);
      console.log( 'checkout session id', JSON.stringify(res?.data?.object?.id));
      const lineItems = await stripe.checkout.sessions.listLineItems(res?.data?.object?.id);
      console.log('line items',lineItems);
      const paymentDetails = extractPaymentDetails(res);
      console.log ('paymentDetails!!!',paymentDetails);
    break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
    

 

    // console.log(
    //   res?.data?.object?.billing_details?.email, // email
    //   res?.data?.object?.amount, // amount
    //   JSON.stringify(res), // payment info
    //   res?.type, // type
    //   String(timeString), // time
    //   String(dateTime), // date
    //   res?.data?.object?.receipt_email, // email
    //   res?.data?.object?.receipt_url, // url
    //   JSON.stringify(res?.data?.object?.payment_method_details), // Payment method details
    //   JSON.stringify(res?.data?.object?.billing_details), // Billing details
    //   res?.data?.object?.currency // Currency
    // );

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
