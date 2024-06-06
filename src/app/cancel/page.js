"use client";
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';


const Cancel = () => {

  const router = useRouter();
  const recentOrder = useRef(null);


  useEffect(() => {
    // Clear the shopping cart when the success page is loaded
   
    const stateFromStorage = window.localStorage.getItem('cartItems');
    recentOrder.current = stateFromStorage && JSON.parse(stateFromStorage);
  

   // Redirect to the home page after 5 seconds
   const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 3000);

    // Clean up the redirect timer when the component unmounts
    return () => clearTimeout(redirectTimer);
  }, [router]);


  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 text-4xl">
      Your Order is Canceled.
    </div>
  );
};

export default Cancel;