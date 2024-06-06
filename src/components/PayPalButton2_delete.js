import {
    PayPalScriptProvider,
    usePayPalScriptReducer,
    getScriptID,
    destroySDKScript,
  } from "@paypal/react-paypal-js";
  
  const SCRIPT_PROVIDER_OPTIONS = {
    clientId: "AYPKDUUhhgy0T2caLtaC0i4Pf3YUg9mHZMrHZV7n9P01hyV2R9TNLOHwCi1V25X3zcKcQECH-GhnGHjt",
  };
  
  // Custom loader component
  const LoadScriptButton = () => {
    const [{ isResolved }, dispatch] = usePayPalScriptReducer();
  
    return (
      <div style={{ display: "inline-flex" }}>
        <button
          type="button"
          style={{ display: "block", marginBottom: "20px" }}
          disabled={isResolved}
          onClick={() => {
            dispatch({
              type: "setLoadingStatus",
              value: "pending",
            });
          }}
        >
          Load PayPal script
        </button>
        <button
          type="button"
          style={{
            display: "block",
            marginBottom: "20px",
            marginLeft: "1em",
          }}
          onClick={() => {
            destroySDKScript(getScriptID(SCRIPT_PROVIDER_OPTIONS));
            dispatch({
              type: "setLoadingStatus",
              value: "initial",
            });
          }}
        >
          Reset
        </button>
      </div>
    );
  };
  
  const PayPalButton = ({ onPaymentSuccess, cart, createOrder }) => {
    const [{ isResolved, isRejected, error }, dispatch] = usePayPalScriptReducer();
  
    return (
      <PayPalScriptProvider options={SCRIPT_PROVIDER_OPTIONS}>
        {isResolved && (
          <PayPalButtons
            forceReRender={[cart]}
            style={{ layout: "horizontal" }}
            createOrder={(data, actions) => createOrder(cart)}
            onApprove={async (data, actions) => {
              const order = await actions.order.capture();
              console.log("Order completed:", order);
              onPaymentSuccess();
            }}
          />
        )}
        {isRejected && <div>Error loading PayPal script: {error.message}</div>}
        <LoadScriptButton />
      </PayPalScriptProvider>
    );
  };
  
  export default PayPalButton;