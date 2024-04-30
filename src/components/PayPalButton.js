// PayPalButton.js

import { useEffect, useState, useRef, useContext } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart} from "./CartContext";
// import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation';

const PayPalButton = ({onPaymentSuccess}) => {

const router = useRouter();
const paypalRef = useRef();
//   const { cart } = useContext(useCart);
const {cart} = useCart();
const[scriptLoaded, setScriptLoaded] = useState(false);

// const addPaypalScript = () => {
//     return new Promise((resolve, reject) => {
//       if (window.paypal) {
//         resolve(window.paypal);
//         return;
//       }
  
//       const script = document.createElement("script");
//       script.src = "https://www.paypal.com/sdk/js?client-id=AYPKDUUhhgy0T2caLtaC0i4Pf3YUg9mHZMrHZV7n9P01hyV2R9TNLOHwCi1V25X3zcKcQECH-GhnGHjt";
//       script.type = "text/javascript";
//       script.async = true;
//       script.onload = () => resolve(window.paypal);
//       script.onerror = reject;
//       document.body.appendChild(script);
//     });
//   };

//   useEffect(() => {
//     addPaypalScript().then((paypal) => {
//       paypalRef.current = paypal;
//     }).catch((error) => {
//       console.error('Failed to load PayPal script:', error);
//     });
//   }, []);



  return (
    <PayPalScriptProvider options={{ 'client-id': 'AYPKDUUhhgy0T2caLtaC0i4Pf3YUg9mHZMrHZV7n9P01hyV2R9TNLOHwCi1V25X3zcKcQECH-GhnGHjt' }}>
      <PayPalButtons
        style={{ layout: 'horizontal' }}
        createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
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
              ],
            });
          }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          console.log('Order completed:', order);
          // Redirect to success page
        //   return NextResponse.json({url:`${process.env.NEXT_PUBLIC_BASE_API_URL}/success`});
        // return NextResponse.redirect('htts://www.google.com');
        // clear the cart
        // clearCart();
        onPaymentSuccess();
        // router.push(`${process.env.NEXT_PUBLIC_BASE_API_URL}/success`);

        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
