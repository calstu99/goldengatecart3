"use client";
import React, { useState, useEffect, useRef, useCallback} from 'react';
import { Button } from "./ui/button";
import { useCart } from "./CartContext";
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import PayPalButton  from './PayPalButton_testing';

const CartModal = () => {
  const { cart, incrementQuantity, decrementQuantity, removeFromCart, isCartOpen, closeCart,openCart,clearCart} = useCart();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [purchaseUnits, setPurchaseUnits] = useState([]);
  const paypalRef = useRef();
  const router = useRouter();
  const addPaypalScript = () => {
    return new Promise((resolve, reject) => {
      if (window.paypal) {
        resolve(window.paypal);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AYPKDUUhhgy0T2caLtaC0i4Pf3YUg9mHZMrHZV7n9P01hyV2R9TNLOHwCi1V25X3zcKcQECH-GhnGHjt";
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => resolve(window.paypal);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }; 

  const updatePurchaseUnits = useCallback(() => {
    setPurchaseUnits([
      {
        amount: {
          value: cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ).toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: cart.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              ).toFixed(2),
            },
          },
        },
        items: cart.map((item, index) => ({
          name: item.name,
          unit_amount: {
            value: item.price.toFixed(2),
            currency_code: 'USD',
          },
          quantity: item.quantity.toString(),
          category: 'PHYSICAL_GOODS',
        })),
      },
    ]);
  }, [cart]);
  
  const handlePaymentSuccess = () => {
    // Reset the cart state
    console.log('clear Cart');
    setPaymentStatus('success');
    clearCart();
    closeCart();
    // router.push(`${process.env.NEXT_PUBLIC_BASE_API_URL}/success`);
  };

  const totalAmount = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const handleDecrement = (productId) => {
    decrementQuantity(productId);

    const product = cart.find((item) => item.id === productId);
    if (product && product.quantity === 0) {
      removeFromCart(productId);
    }
  };

  const checkout = async () => {
    await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products: cart }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
        if (response.url) {
          window.location.href = response.url;
        }
      });
  };

  useEffect(() => {
    updatePurchaseUnits();
  }, [cart, updatePurchaseUnits]);

   // Load the PayPal script only once
   useEffect(() => {
    addPaypalScript().then((paypal) => {
      paypalRef.current = paypal;
    }).catch((error) => {
      console.error('Failed to load PayPal script:', error);
    });
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      window.scrollTo(0, 0); // Scroll to the top of the page
    }
  }, [isCartOpen]);

  console.log('cart',cart);

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      {/* <SheetTrigger>Open Cart</SheetTrigger> */}
      <SheetContent className="sm:max-w-lg w-[90vw]">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <br/>
        </SheetHeader>
        <div>
          <ul>
            {cart.map((product) => (
              <li
                key={product.id}
                className="flex justify-between items-center mb-2"
              >
                <div className='flex-1'>
                  <div className='w-48 truncate'>
                  <p className="font-semibold">{product.name}</p>
                  </div>
                 
                  <p className="text-gray-400">
                    ${product.price.toFixed(2)} x {product.quantity}
                  </p>
                  <p className="text-gray-400 text-sm">{product.category}</p>
                </div>
                <br/>
                
                <div className="ml-4 flex space-x-2">
                <br/>
                  <button
                    onClick={() => handleDecrement(product.id)}
                    className="scale-25 ml-6 px-2 py-1 bg-red-500 text-white hover:bg-red-600/50 w-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                  >
                    -
                  </button>
                  <button
                    onClick={() => incrementQuantity(product.id)}
                    className="scale-25 ml-4 px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 w-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    +
                  </button>
               
                </div>
              </li>
            ))}
          </ul>
        </div>

      
        {cart.length > 0 ? (
          <>
         
          <div className="mt-4">
            <p className="text-lg font-semibold">
              Total Amount: ${totalAmount.toFixed(2)}
            </p>
            {/* <button
              onClick={checkout}
              className="mt-4 px-4 py-2 bg-red-500 text-white hover:bg-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Buy Now
            </button> */}
            <br/><br/>
               <Button 
             onClick={checkout}>
             Buy Now
            </Button>
            <br/><br/>
            <PayPalButton onPaymentSuccess={handlePaymentSuccess} purchaseUnits={purchaseUnits} />
          </div>
          <br/>
          <div className="mt-6 flex justify-left text-center text-xl text-gray-500">
              <p>
                OR{" "}
                <br/><br/>
                <button
                  onClick={() => closeCart()}
                  className=" font-medium text-primary hover:text-primary/80"
                >
                  Continue Shopping
                </button>
              </p>
            </div>

          </>
          
        ) : (
          <p className="mt-4 text-lg font-semibold">You dont have any items</p>
        )}


      </SheetContent>
    </Sheet>
  );
};

export default CartModal;