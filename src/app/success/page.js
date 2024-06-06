"use client";
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from "../../components/CartContext";



const Success = () => {

  const router = useRouter();
  const recentOrder = useRef(null);
  

  
  useEffect(() => {
    // Clear the shopping cart when the success page is loaded
   
    const stateFromStorage = window.localStorage.getItem('cartItems');
    recentOrder.current = stateFromStorage && JSON.parse(stateFromStorage);
    console.log('recent order',recentOrder.current);
    console.log('recent order',recentOrder.current[0].name);


      // Check if recentOrder.current is an object
  if (typeof recentOrder.current === 'object' && recentOrder.current !== null) {
    console.log('recentOrder.current is an object');
  } else {
    console.log('recentOrder.current is not an object');
  }


    // console.log('recent order',recentOrder.current[1].name);
   // write recent Order to database and track fulfillment.
  
   // clearShoppingCart();
    clearShoppingCart();

   // Redirect to the home page after 10 seconds
   const redirectTimer = setTimeout(() => {
      router.push('/');
      // to refresh paypal transactions - page need to refresh to clear the cart.
      //window.location.reload();
    }, 5000);

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
      <h1>Your Order is Completed</h1>
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
