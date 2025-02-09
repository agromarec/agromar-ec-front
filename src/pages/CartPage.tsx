import { useMemo, useState } from 'react';
import { CartButton } from "@/components/common/CartButton";
import { Paypal } from "@/components/payment/Paypal";
import { Button } from "@/components/ui/button";
import { globalVariables } from "@/config/globalVariables";
import { formatter, to } from "@/helpers";
import { IProduct } from "@/interfaces/products";
import useCartStore from "@/store/cartStore";
import { NavLink } from "react-router-dom";
import { AgroMarApi } from "@/api/AgroMarApi";
import { toast } from "sonner";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { useNavigate } from 'react-router';
import { QuoteButton } from '@/components/Quote';


export const CartPage = () => {
  const cartItems = useCartStore(state => state.cartItems);
  const emptyCartAsync = useCartStore(state => state.emptyCartAsync);
  const subtotal = useCartStore(state => state.subtotal);
  const total = useCartStore(state => state.total);
  const [transferModal, setTransferModal] = useState(false);
  const navigate = useNavigate();

  const sellerInfo = useMemo(() => {
    return cartItems[(Object.keys(cartItems)[0] as any)]?.user_ce as any;
  }, [cartItems]);

  const firstBankInfo = useMemo(() => {
    let result = '';
    if (!sellerInfo?.bankTransfersInfo) return '';
    const bankTransfersInfo = sellerInfo.bankTransfersInfo.split('-');

    if (sellerInfo.bankTransfersInfo) {
      const hasAllInfo = bankTransfersInfo[0] && bankTransfersInfo[1] && bankTransfersInfo[2] && bankTransfersInfo[3] && bankTransfersInfo[4] && bankTransfersInfo[5];
      if (!hasAllInfo) return '';
      result += bankTransfersInfo[0] + '\n';
      result += '# de Cuenta' + bankTransfersInfo[1] + '\n';
      result += bankTransfersInfo[2] + '\n';
      result += 'Cédula o RUC' + bankTransfersInfo[3] + '\n';
      result += bankTransfersInfo[4] + '\n';
    }
    return result;
  }, [sellerInfo]);

  const secondBankInfo = useMemo(() => {
    let result = '';
    if (!sellerInfo?.bankTransfersInfo) return '';
    const bankTransfersInfo = sellerInfo.bankTransfersInfo.split('-');

    if (sellerInfo.bankTransfersInfo) {
      const hasAllInfo = bankTransfersInfo[5] && bankTransfersInfo[6] && bankTransfersInfo[7] && bankTransfersInfo[8] && bankTransfersInfo[9];
      if (!hasAllInfo) return '';
      result += bankTransfersInfo[5] + '\n';
      result += '# de Cuenta' + bankTransfersInfo[6] + '\n';
      result += bankTransfersInfo[7] + '\n';
      result += 'Cédula o RUC' + bankTransfersInfo[8] + '\n';
      result += bankTransfersInfo[9] + '\n';
    }
    return result;
  }, [sellerInfo]);


  if (Object.keys(cartItems).length === 0) return (
    <div className="container mx-auto pb-12">
      <h1 className="text-4xl mx-auto text-center font-bold mt-10">Carrito de compras</h1>
      <p className="text-center text-4xl text-gray-400 font-bold mt-24">Tu carrito está vacío</p>
      <p className="text-center text-xl text-gray-400 mt-4">
        Agrega algun producto a tu carrito para poder realizar la compra
      </p>

      <div className="flex justify-center mt-8">
        <NavLink to={'/productos'} className="mt-2 text-xl">
          <Button className="mt-2 text-xl" size={'lg'}>Ver productos</Button>
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto pb-12">
      <h1 className="text-4xl mx-auto text-center font-bold mt-10">Carrito de compras</h1>

      <div className="flex justify-between mt-10 gap-4">
        <div className="flex flex-col gap-4 basis-1/3 border-2 border-gray-300 rounded-lg p-4 flex-1 h-fit">
          <h2 className="text-2xl font-bold">Productos</h2>
          {
            Object.keys(cartItems).map((cartItemKey: any) => (
              <CartItem key={cartItemKey} cartItem={cartItems[cartItemKey]} />
            ))
          }
        </div>

        <div className="flex flex-col gap-4 basis-[28%] border-2 border-gray-300 rounded-lg p-4 flex-1/2 h-fit">
          <p className="py-2 px-4 text-center text-sm font-bold bg-primary text-white">Facturación Electrónica</p>

          <p className="font-bold text-xl">Entrega</p>
          <p>
            Somos su fuente confiable en soluciones agricolas de
            exportacion, brindando productos de la mas alta
            calidad para impulsar su negocio.
          </p>

          <QuoteButton />

          <div className="grid grid-cols-2 gap-4 mt-4 mx-auto w-full text-xl">
            <p>SubTotal</p>
            <p className="text-end">{formatter({ value: subtotal })}</p>

            <p>IVA</p>
            <p className="text-end">{formatter({ value: subtotal * globalVariables.tax })}</p>

            <p>Total</p>
            {/* <p className="font-bold text-end">{formatter({ value: total })}</p> */}
            <p className="font-bold text-end">{formatter({ value: total + subtotal * globalVariables.tax })}</p>
          </div>


          {/* <Button className="my-2">Finalizar pedido</Button> */}
          {
            sellerInfo.allowBankTransfers &&
            <>
              <p className="font-bold text-xl">Transferencia bancaria</p>
              <div className="
                    grid
                    text-sm
                    after:px-3.5
                    after:py-2.5
                    [&>textarea]:text-inherit
                    after:text-inherit
                    [&>textarea]:resize-none
                    [&>textarea]:[grid-area:1/1/2/2]
                    after:[grid-area:1/1/2/2]
                    after:whitespace-pre-wrap
                    after:invisible
                    after:content-[attr(data-cloned-val)_'_']
                    after:border
                    overflow-auto
                ">
                <textarea
                  className="w-full text-slate-600 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded-md px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 h-full min-h-40 text-lg overflow-auto cursor-default"
                  name="message"
                  id="message"
                  readOnly
                  value={`${firstBankInfo}${secondBankInfo}`}
                ></textarea>
              </div>

              <Button
                onClick={() => setTransferModal(true)}
              >Realizar transferencia</Button>
            </>
          }

          {
            sellerInfo?.allowPaypalPayments &&
            <Paypal />
          }
        </div>
      </div>

      <CustomDialog
        isOpen={transferModal}
        onOpenChange={setTransferModal}
        title="Transferencia bancaria"
        content={() => (
          <div>
            <p className='my-4'>
              Tenga en cuenta que debe realizar la transferencia a una de las cuentas presentes. Tenga en cuenta que este proceso puedo tardar hasta 3 días en completarse. Una vez se confirme su transferencia, un agente se pondrá en contacto con usted para coordinar el lugar de entrega.
            </p>

            <div className="flex flex-col gap-4 w-full">
              <Button className="my-2"
                onClick={async () => {
                  const [, error] = await to(AgroMarApi.post('/payment/bank-transfer', {
                    // amount: sellerInfo.bankTransfersInfo,
                    // paypalEmail: sellerInfo.paypalEmail,
                  }));

                  if (error) return toast.error(error.message);
                  toast.success('Transferencia realizada exitosamente');
                  emptyCartAsync();
                  navigate('/usuario/mis-compras');
                }}
              >Finalizar pedido</Button>
            </div>
          </div>
        )}
      />
    </div>
  )
};

const CartItem = ({ cartItem }: { cartItem: IProduct & { quantity: number } }) => {

  return (
    <div>
      <div className="flex gap-4 mt-2">
        <img src={!cartItem.image ? '/no-image.png' : `${cartItem.image}`} alt={cartItem.description} width={200} height={140} className="object-cover rounded-lg my-auto max-h-200" />
        <div className="flex flex-col gap-2 w-full">
          <p className="text-lg font-bold">{cartItem?.predefinedProduct?.name}</p>

          <p>{cartItem.description}</p>

          <div className="flex gap-4 items-center">
            <p className="font-bold">Precio Unitario:</p>
            <p className="text-sm">{formatter({ value: cartItem.price })}</p>

            <p className="font-bold">Stock:</p>
            <p className="text-sm">{cartItem.stock}</p>
          </div>

          <div className="flex-1" />

          <div className="mb-2 flex items-center justify-between w-ful">
            <CartButton product={cartItem} type="ghost" />

            <div className="flex-1" />

            <div>
              <p className="text-xl">Total: <span className="font-bold">{formatter({ value: cartItem.price * cartItem.quantity })}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-gray-300 flex justify-between items-center mt-2" />
    </div>
  )
}
