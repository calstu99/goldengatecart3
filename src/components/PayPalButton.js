// PayPalButton.js

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({onPaymentSuccess, purchaseUnits}) => {

  return (
    // customize button - https://medium.com/@mahdidavoodi7/how-to-have-a-fully-customized-paypal-button-in-react-b9b860d80d2d
    <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID  }}>
      <PayPalButtons
        style={{ layout: 'horizontal', size:"small" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: purchaseUnits,

          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          console.log('Order completed:', order);
          onPaymentSuccess();
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
