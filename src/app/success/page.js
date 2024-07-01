"use client";
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from "../../components/CartContext";
import {Handshake} from 'lucide-react';


const Success = () => {

  const router = useRouter();
  const recentOrder = useRef(null);

  const sendEmail = async(total) =>{
    const to = 'haenergycapital@gmail.com';
    const subject = 'Thank you for your order';
    const text = 'This is a test order';
  
    try {
      const response = await fetch('/api/email/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, text, total }),
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



  

  useEffect(() => {
    // Clear the shopping cart when the success page is loaded
   
    const stateFromStorage = window.localStorage.getItem('cartItems');
    recentOrder.current = stateFromStorage && JSON.parse(stateFromStorage);
    // console.log('recent order',recentOrder.current);
    // console.log('recent order',recentOrder.current[0].name);


      // Check if recentOrder.current is an object
  if (typeof recentOrder.current === 'object' && recentOrder.current !== null) {
    console.log('recentOrder.current is an object');
  } else {
    console.log('recentOrder.current is not an object');
  }


    // console.log('recent order',recentOrder.current[1].name);
   // write recent Order to database and track fulfillment.

   // send email
   const total = 99.99;  // just placeholder
  //  sendEmail(total);
  
   // clearShoppingCart();
    clearShoppingCart();

   // Redirect to the home page after 5 seconds
   const redirectTimer = setTimeout(() => {
      router.push('/');
      // to refresh paypal transactions - page need to refresh to clear the cart.
      //window.location.reload();
    }, 3000);

    // Clean up the redirect timer when the component unmounts
    return () => clearTimeout(redirectTimer);
  }, [router]);


  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  function clearShoppingCart() {
       localStorage.removeItem('cartItems');
       console.log('clearing shopping cart');
   }

  return (
    <>
    
{/*    
      <div className="flex min-h-screen flex-col items-center justify-between p-24 text-4xl">
        Your Order is Completed
      </div> */}


      {/* <div className="flex min-h-screen flex-col items-center justify-between p-24 text-4xl">
      Your Order is Completed
    </div> */}
    <div className="flex min-h-screen flex-col items-center justify-between p-5">
      {/* <h1>Your Order is Completed</h1> */}
     
      <div className="flex flex-col items-center">
      <h1 className="mt-2 text-2xl text-gray-700">Thank you for your order!</h1>
      <h1 className="mt-2 text-xl text-gray-700">We are now processing your order.</h1>
        <Handshake color="#3e9392" size={200} strokeWidth={0.6} fill="#bae2e2" />
        {/* <p className="mt-4 text-lg font-semibold">Shopping Cart</p> */}
      </div>
      

      {recentOrder.current && (
        <div>
          <h2>Recent Order:</h2>
          <ul>
            {recentOrder.current.map((item, index) => (
              <li key={index}>
                <p>
                  <strong>Name:</strong> {item.name}
                </p>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>


    </>
  );
};

export default Success;
