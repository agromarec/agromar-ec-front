import { AgroMarApi } from '@/api/AgroMarApi';
import { to } from '@/helpers';
import useCartStore from '@/store/cartStore';
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions, usePayPalScriptReducer, PayPalButtonsComponentProps } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const initialOptions: ReactPayPalScriptOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: 'USD'
};

export const Paypal = () => {


  return (
    <PayPalScriptProvider options={initialOptions}>
      <PaypalActions />
    </PayPalScriptProvider>
  )
};


export const PaypalActions = () => {
  const navigate = useNavigate();
  const emptyCart = useCartStore(state => state.emptyCart);
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) return (
    <div className='animate-pulse'>
      <div className="h-8 bg-gray-300 rounded" />
    </div>
  )

  const createOrder: PayPalButtonsComponentProps['createOrder'] = async () => {
    const [response, error] = await to(AgroMarApi.post('/payment', {
      paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    }));

    if (error) toast.error(error.message);

    const transactionId = response?.data.transactionId;

    return transactionId;
  }


  const onApproveOrder: PayPalButtonsComponentProps['onApprove'] = async (data) => {
    const [, error] = await to(AgroMarApi.post('/payment/approve', {
      paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
      transactionId: data.orderID,
    }));

    if (error) toast.error(error.message);
    else {
      toast.success('Transacción aprobada');
      emptyCart();
      navigate('/usuario/mis-compras');
    }
  }

  const onCancelOrder: PayPalButtonsComponentProps['onCancel'] = async (data) => {
    const [, error] = await to(AgroMarApi.delete(`/payment/${data.orderID}/`));

    if (error) toast.error(error.message);

    toast.success('Transacción cancelada');
  }

  return (
    <div className='z-0'>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApproveOrder}
        onCancel={onCancelOrder}
      />
    </div>
  )
};
