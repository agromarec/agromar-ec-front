import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const initialOptions: ReactPayPalScriptOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: 'USD',
  // intent: 'authorize',
  // commit: true,
  // style: {
  //   layout: 'vertical',
  //   color: 'blue',
  //   shape: 'rect',
  //   label: 'paypal',
  //   tagline: false,
  // },
};

export const Paypal = () => {


  return (
    <PayPalScriptProvider options={initialOptions}>
      <PaypalActions />
    </PayPalScriptProvider>
  )
};


export const PaypalActions = () => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) return (
    <div className='animate-pulse'>
      <div className="h-8 bg-gray-300 rounded" />
    </div>
  )

  function createOrder() {
    return fetch("/my-server/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        cart: [
          {
            id: "YOUR_PRODUCT_ID",
            quantity: "YOUR_PRODUCT_QUANTITY",
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  }


  function onApprove(data) {
    return fetch("/my-server/capture-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID
      })
    })
      .then((response) => response.json())
      .then((orderData) => {
        const name = orderData.payer.name.given_name;
        alert(`Transaction completed by ${name}`);
      });
  }
  return (
    <PayPalButtons
      createOrder={createOrder}
    // onApprove={(data) => {
    //   data.
    // }}
    />
  )
};
