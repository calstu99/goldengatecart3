const stripe = require("stripe")(process.env.STRIPE_SECRET);


// Payment Details to capture from transaction
/* 
Name, email, address,items, total, currency, status, time, date
*/

const currentDateTime = new Date();

const extractPaymentDetails = (res,purchasedItems) => {
const name = res?.data?.object?.customer_details?.name;
const email = res?.data?.object?.customer_details?.email;
const address = res?.data?.object?.customer_details?.address;
const sub_total = (res?.data?.object?.amount_subtotal / 100).toFixed(2);
const currency = res?.data?.object.currency;
const status = res?.data?.object?.payment_status;
const items = purchasedItems;

const currentTime = currentDateTime.toLocaleTimeString(); // time
const currentDate = currentDateTime.toLocaleDateString(); // date
const paymentMethod = 'Stripe'; // payment Method

return {name, email,address, items, sub_total, currency, status, currentTime, currentDate, paymentMethod};
}

// const extractPaymentDetails = (res, eventType) => {

//   let name = null, email = null, address = null, total = null, currency = null, status = null, receipt_url = null, lineItems = null;

//   if (eventType === 'charge.succeeded') {
//     name = res?.data?.object?.billing_details?.name || null; // name
//     email = res?.data?.object?.billing_details?.email || null; // email
//     address = res?.data?.object?.billing_details?.address || null; // address
//     total = (res?.data?.object?.amount / 100).toFixed(2) || null; // total
//     currency = res?.data?.object?.currency || null; // currency
//     status = res?.data?.object?.paid || null; // status
//     receipt_url = res?.data?.object?.receipt_url || null; // receipt url
//   } else if (eventType === 'checkout.session.completed') {
//     // Extract relevant details from the event payload
//     const { customer_details, amount_total } = res?.data?.object || {};
//     name = customer_details?.name || null;
//     email = customer_details?.email || null;
//     address = customer_details?.address || null;
//     total = (amount_total / 100).toFixed(2) || null;
//     currency = res?.data?.object.currency || null;
//     status = res?.data?.object?.payment_status || null; // status

//     // Fetch line items for the checkout session
//     const sessionId = res?.data?.object?.id;
//     lineItems = sessionId ? stripe.checkout.sessions.listLineItems(sessionId) : null;
//   }

//   const currentTime = currentDateTime.toLocaleTimeString(); // time
//   const currentDate = currentDateTime.toLocaleDateString(); // date
//   const paymentMethod = 'Stripe'; // payment Method

//   return { name, email, address, total, currency, status, receipt_url, lineItems, currentTime, currentDate, paymentMethod };
// };

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
      console.log('charge succeeded triggered');
    // const paymentDetailsCharge = extractPaymentDetails(res, 'charge.succeeded');
    // await savePaymentDetailsToDatabase(paymentDetailsCharge);
    // console.log ('paymentDetails!!!',paymentDetailsCharge);
    // console.log( JSON.stringify(res?.data?.object));
    break;
    case 'checkout.session.completed':
      console.log('checkout.session.completed triggered');
      // console.log( 'checkout session completed', JSON.stringify(res?.data?.object));
      // const lineItems = event.data.object.line_items; // doesn't exist.
      // const purchasedItems = lineItems.data.map((item) => ({
      //   name: item.description,
      //   quantity: item.quantity,
      //   price: item.price.unit_amount,
      // }));
      // console.log("Purchased Items:", purchasedItems);
      // console.log( 'checkout session id', JSON.stringify(res?.data?.object?.id));

      const lineItems = await stripe.checkout.sessions.listLineItems(res?.data?.object?.id);
      // console.log('line items',JSON.stringify(lineItems));
      const purchasedItems = lineItems.data.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        unit_price:(item.price.unit_amount/100).toFixed(2),
        amount_total:(item.amount_subtotal/100).toFixed(2),
      }));

      

      console.log('purchased items', purchasedItems);

      // console.log('email',res?.data?.object?.customer_details?.email);

      const paymentDetailsCheckout = extractPaymentDetails(res,purchasedItems);
      console.log ('paymentDetails Checkout!!!', paymentDetailsCheckout);

      // await savePaymentDetailsToDatabase(paymentDetailsCheckout);
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
