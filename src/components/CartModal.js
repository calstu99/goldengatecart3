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
import {Minus,Plus,Trash, ShoppingCart, ShoppingBag, CreditCard} from 'lucide-react';
import PayPalButton  from './PayPalButton';
import Image from 'next/image';
import cc_image from '../../public/images/payment.png';

const CartModal = () => {
  const { cart, incrementQuantity, decrementQuantity, removeFromCart, isCartOpen, closeCart,openCart,clearCart} = useCart();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [purchaseUnits, setPurchaseUnits] = useState([]);
  const [paypalButtonKey, setPaypalButtonKey] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Coupon Code
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCodeStatus, setCouponCodeStatus] = useState('');

  

  const paypalRef = useRef();
  const router = useRouter();
  const addPaypalScript = () => {
    return new Promise((resolve, reject) => {
      if (window.paypal) {
        resolve(window.paypal);
        return;
      }
      const script = document.createElement("script");
      // script.src = "https://www.paypal.com/sdk/js?client-id=AYPKDUUhhgy0T2caLtaC0i4Pf3YUg9mHZMrHZV7n9P01hyV2R9TNLOHwCi1V25X3zcKcQECH-GhnGHjt";
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`;
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => resolve(window.paypal);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }; 



  // function to apply the coupon code and calculate the discount:
  // Environment Variable Prefix: For environment variables to be accessible in the browser (client-side code), they must be prefixed with NEXT_PUBLIC_. This is a requirement in Next.js to differentiate between server-side and client-side environment variables.
  
  // useEffect(() => {
  //   if (couponCode !== '') {
  //     applyCouponCode();
  //   }
  // }, [couponCodeStatus]);
  
  
  const applyCouponCode = () => {
    const discountCode = process.env.NEXT_PUBLIC_DISCOUNT_CODE;
    console.log('discount code',discountCode);
    const discountAmount = parseFloat(process.env.NEXT_PUBLIC_DISCOUNT_AMOUNT);
    console.log("couponcode entered",couponCode);
    if (couponCode.toUpperCase() === discountCode) {
      const discount = totalAmount * discountAmount; // 10% discount
      setDiscountAmount(discount);
      setCouponCodeStatus('valid');
    } else {
      setDiscountAmount(0);
      setCouponCodeStatus('invalid');
    }
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
    // console.log("payment status", paymentStatus);
    clearCart();
    closeCart();
    router.push(`${process.env.NEXT_PUBLIC_BASE_API_URL}/success`);
  };

  // const totalAmount = cart.reduce(
  //   (total, product) => total + product.price * product.quantity,
  //   0
  // );
  // Update the totalAmount calculation to include the discount:
  const totalAmount = (cart.reduce((total, product) => total + product.price * product.quantity, 0) - discountAmount).toFixed(2);
  // const totalAmount = cart.reduce((total, product) => total + product.price * product.quantity, 0) - discountAmount.toFixed(2);

  const totalQuantity = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );


  const handleDecrement = (productId) => {
    decrementQuantity(productId);
   setPaypalButtonKey(paypalButtonKey + 1);

    const product = cart.find((item) => item.id === productId);
    if (product && product.quantity === 0) {
      removeFromCart(productId);
    }
  };

  // const handleIncrement = (productId) => {
  //   incrementQuantity(productId);
  //   setPaypalButtonKey(paypalButtonKey + 1);
  // };
  const handleIncrement = (productId) => {
    const product = cart.find((item) => item.id === productId);
    if (product && product.quantity < 25) {
      incrementQuantity(productId);
      setPaypalButtonKey(paypalButtonKey + 1);
    } else {
      // Optionally, you can show a message to the user
      alert("Maximum quantity of 25 units reached for this product.");
    }
  };

  // const checkout = async () => {
  //   await fetch("/api/checkout", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ products: cart }),
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       if (response.url) {
  //         window.location.href = response.url;
  //       }
  //     });
  // };

  const checkout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: cart }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Checkout response:", data);
  
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.warn("No redirect URL provided in the response");
      }
    } catch (error) {
      console.error("Checkout error:", error.message);
      
       // You can add more specific error handling here
      if (error instanceof TypeError) {
        console.error("Network error: Please check your internet connection");
      } else if (error instanceof SyntaxError) {
        console.error("JSON parsing error: Invalid response from server");
      }
    }
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
   
          {/* <SheetTitle className="text-3xl">Cart</SheetTitle> */}
          
          <br/>
        </SheetHeader>
        <div className='pb-40 max-h-screen overflow-y-auto scrollbar-thumb-gray-200 scrollbar-track-gray-100 '>
        <div>
          {cart.length > 0 ? (
            <>
            <div>
            <p className="text-2xl text-gray-700 font-bold border-b-2 border-gray-500">Cart Summary</p>
            </div>

              <div className="mt-4">
                  <div className="flex items-center">
                    <ShoppingCart color="#6d28d9" size={30} strokeWidth={1.2} className="mr-2" />
                    <p className="text-lg font-medium">
                      {/* {`Subtotal (${totalQuantity} items): $${totalAmount.toFixed(2)}`} */}
                      {/* <span>Subtotal {totalQuantity > 1 ? `(${totalQuantity} items):  $${totalAmount.toFixed(2)}` : `(${totalQuantity} item): $${totalAmount.toFixed(2)} `}  </span> */}
                      <span>
                        Subtotal {totalQuantity > 1 ? `(${totalQuantity} items): $${totalAmount.toLocaleString()}` : `(${totalQuantity} item): $${totalAmount.toLocaleString()}`}
                      </span>
                    </p>
                  </div>
                {/* <button
              onClick={checkout}
              className="mt-4 px-4 py-2 bg-red-500 text-white hover:bg-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Buy Now
            </button> */}
                <br /><br />
                <div className="flex items-center justify-start space-x-4" >
                <Button 
                // className = "bg-[#345f81] hover:bg-[#224d6f] flex items-center"
                // className = "bg-gray-700 hover:bg-grey-300 flex items-center"
                className={`flex items-center ${
                  isCheckingOut 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={checkout}>
                <CreditCard color="#ffffff" size={25} strokeWidth={0.9} className="mr-2" />
                 {/* Proceed to checkout */}
                 {isCheckingOut ? 'Processing...' : 'Proceed to checkout'}
                </Button>
                <Image
                    src={cc_image}
                    alt="Credit Card Options"
                    width={140}
                    height={140}
                    className="object-contain"
                  />
                </div>
                
                <br />
                <PayPalButton
                  key={paypalButtonKey} //  key prop on the PayPalButton component is still used to force a re-render when the cart changes, ensuring that the PayPal Buttons always display the correct total amount.
                  onPaymentSuccess={handlePaymentSuccess}
                  purchaseUnits={purchaseUnits} />
              </div>
             
              {/* <div className="mt-6 flex justify-left text-center text-xl text-gray-500">
                <p>
                  OR{" "}
                  <br />
                  <button
                    onClick={() => closeCart()}
                    className=" font-medium text-primary hover:text-primary/80"
                  >
                    Continue Shopping
                  </button>
                  <br /><br />
                </p>
                
              </div> */}

            </>

          ) : (
            <>
                  <div className="flex flex-col items-center justify-center h-screen">
                    <div className="flex flex-col items-center">
                      <ShoppingBag color="#3e9392" size={110} strokeWidth={0.6} fill="#bae2e2" />
                      {/* <p className="mt-4 text-lg font-semibold">Shopping Cart</p> */}
                    </div>
                    <p className="mt-2 text-lg text-gray-700">You don't have any items!</p>
                    <p className="mt-2 text-gray-700">Zip. Zilch. Nada.</p>
                  </div>
            </>
          )}

        </div>
        <br />
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
                    <img
                      src={product.imageUrl}
                      alt={product.imageUrl}
                      className="mb-4 object-cover w-10 cursor-none"
                    />
                  </div>

                  <p className="font-light text-grey-500 text-sm line-clamp-1">
                    {/* ${product.price.toFixed(2)} x {product.quantity} */}
                    <span className='font-bold' >Qty:{product.quantity}</span> {product.name}
                  </p>
                  <p className="font-bold text-grey-500 text-sm mb-2">
                  Price: ${product.price.toFixed(2)}
                  </p>
                  {/* <p className="text-gray-400 text-sm">{product.category}</p> */}
                </div>
                <br />
                <div className='flex flex-col items-center justify-content'>
                  <div className="flex justify-between h-10 w-35 overflow-hidden rounded-lg border border-indigo-100">
                    <br />
                    <button
                      onClick={() => handleDecrement(product.id)}
                      // className="flex-1 px-2 py-1 bg-gray-100 text-zinc-500 hover:bg-blue-200/50 rounded"
                      className="flex items-center justify-center px-2 py-1 bg-zinc-100 text-zinc-500 hover:bg-blue-200/50 rounded"
                    >
                      <Minus size={15} color="#808080" />
                    </button>
                    <button
                      onClick={() => handleIncrement(product.id)}
                      // className="flex-1 px-2 py-1 bg-gray-100 text-zinc-500 hover:bg-blue-200/50 rounded"
                      className="flex items-center justify-center px-2 py-1 bg-zinc-100 text-zinc-500 hover:bg-blue-200/50 rounded"
                    >
                      <Plus size={15} color="#000000" />
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      // className="flex-1 px-2 py-1 bg-gray-100 text-zinc-500 hover:bg-blue-200/50 rounded"
                      className="flex items-center justify-center px-2 py-1 bg-zinc-100 text-zinc-500 hover:bg-blue-200/50 rounded"
                    >
                      <Trash size={15} color="#626664" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
          
          {/* <div className="pt-0 fixed bottom-0 right-80 bg-white p-4 bg-zinc-50/95">
          <p className="mt-6 font-bold text-md">
            {`Subtotal: $${totalAmount.toFixed(2)}`}
          </p>
          </div> */}


{cart.length > 0 ? (
         <>
        <div className="flex items-center mb-4 mt-8">
         <input
           type="text"
           placeholder="Enter coupon code"
           value={couponCode}
           onChange={(e) => setCouponCode(e.target.value)}
           className={`flex-1 px-4 py-2 ml-2 mr-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-slate-200 ${couponCodeStatus === 'valid' ? 'blur' : ''}`}
           disabled={couponCodeStatus === 'valid'}
         />
         {/* <button
           onClick={applyCouponCode}
           className={`px-4 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${couponCodeStatus === 'valid' ? 'blur ' : ''}`}
 
           // className="px-4 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
         >
           Apply
         </button> */}
             {couponCodeStatus !== 'valid' && (
               <button
                 onClick={applyCouponCode}
                 className="px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               >
                 Apply
               </button>
             )}
       </div>
       <p className={`text-sm ${couponCodeStatus === 'valid' ? 'text-green-500' : 'text-red-500'}`}>
         {couponCodeStatus === 'valid' ? 'Discount code applied' : couponCodeStatus === 'invalid' ? 'Incorrect coupon code' : ''}
       </p>

       </>
          ) : <div></div>
          }
         

          {cart.length > 0 ? (
            <div className="fixed bottom-0 right-0 bg-white p-4 w-full sm:w-auto sm:mr-4">
              <p className="mt-6 text-xl font-bold text-right">
                {/* {`Subtotal: $${totalAmount.toFixed(2)}`} */}
                {/* <span>Subtotal {totalQuantity > 1 ? `(${totalQuantity} items):  $${totalAmount.toFixed(2)}` : `(${totalQuantity} item): $${totalAmount.toFixed(2)} `}  </span> */}
                <span>
                  Subtotal {totalQuantity > 1 ? `(${totalQuantity} items): $${totalAmount.toLocaleString()}` : `(${totalQuantity} item): $${totalAmount.toLocaleString()}`}
                </span>
              </p>
            </div>
          ) : <div></div>
          }
          
        {/* <div>
          {cart.length > 0 ? (
            <>

              <div className="mt-4">
                <p className="text-lg font-semibold">
                  Total Amount: ${totalAmount.toFixed(2)}
                </p>
             
                <br /><br />
                <Button
                  onClick={checkout}>
                  Buy Now
                </Button>
                <br /><br />
                <PayPalButton
                  key={paypalButtonKey} //  key prop on the PayPalButton component is still used to force a re-render when the cart changes, ensuring that the PayPal Buttons always display the correct total amount.
                  onPaymentSuccess={handlePaymentSuccess}
                  purchaseUnits={purchaseUnits} />
              </div>
              <br />
              <div className="mt-6 flex justify-left text-center text-xl text-gray-500">
                <p>
                  OR{" "}
                  <br /><br />
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
        </div> */}

        </div>
      
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;