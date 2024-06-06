// PayPalButton.js

import { useEffect, useState, useRef, useContext } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart} from "./CartContext";
// import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation';

const PayPalButton = ({onPaymentSuccess, purchaseUnits}) => {

const router = useRouter();
const paypalRef = useRef();
//   const { cart } = useContext(useCart);
const {cart} = useCart();
const[scriptLoaded, setScriptLoaded] = useState(false);

  return (
    <PayPalScriptProvider options={{ 'client-id': 'AYPKDUUhhgy0T2caLtaC0i4Pf3YUg9mHZMrHZV7n9P01hyV2R9TNLOHwCi1V25X3zcKcQECH-GhnGHjt' }}>
      <PayPalButtons
        style={{ layout: 'horizontal' }}
        createOrder={(data, actions) => {
            return actions.order.create({
                purchase_units:purchaseUnits,
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