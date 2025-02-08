import { Page, Text, View, Document, StyleSheet, usePDF, Image } from '@react-pdf/renderer';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { CustomDialog } from './ui/CustomDialog';
import useCartStore from '@/store/cartStore';
import { IProduct } from '@/interfaces/products';
import { formatter } from '@/helpers';
import { globalVariables } from '@/config/globalVariables';
import useAuthStore from '@/store/authStore';
import { IUserResponse } from '@/interfaces/users';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  section: {
    // margin: 10,
    // padding: 10,
  }
});

// Create Document Component
const QuoteDocument = (cartItems: (IProduct & { quantity: number; })[], { total, subtotal }: any, user: IUserResponse) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ flexDirection: 'column', width: '100%', paddingHorizontal: 40 }}>

        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: 12, marginBottom: 10 }}>
            {
              formatter({ date: new Date(), as: 'date', dateStyle: 'full', language: 'es' }).charAt(0).toUpperCase() + formatter({ date: new Date(), as: 'date', dateStyle: 'full', language: 'es' }).slice(1)
            }
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cotización</Text> */}
            <Text style={{ fontSize: 10, fontWeight: 'bold', maxWidth: 250 }}>Estimado {user.name} {user.lastName}, se adjunta la cotización de la compra de los productos que has solicitado.</Text>

            <Image src={'/logo.jpeg'} style={{ width: 130, height: 45, marginTop: -14 }} />
          </View>
        </View>


        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Detalles de la Cotización</Text>
        <View 
          style={{
            borderBottomWidth: 1,
            borderColor: 'black',
            paddingBottom: 10,
            marginBottom: 14
          }}
        />

        <View style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginBottom: 4
        }}>
          <Text style={{ fontSize: 12, flexBasis: '50%', textAlign: 'left' }}>Nombre</Text>
          <Text style={{ fontSize: 12, flexBasis: '12%', textAlign: 'right' }}>Cantidad</Text>
          <Text style={{ fontSize: 12, flexBasis: '20%', textAlign: 'right' }}>Precio Unitario</Text>
          <Text style={{ fontSize: 12, flexBasis: '20%', textAlign: 'right' }}>Total</Text>
        </View>

        <View style={{ justifyContent: 'space-between' }}>
          {
            cartItems.map(item => (
              <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexBasis: '50%' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.predefinedProduct.name}</Text>
                  <Text style={{ fontSize: 9 }}>{item.description}</Text>
                </View>

                <Text style={{ fontSize: 12, flexBasis: '10%', textAlign: 'right' }}>{item.quantity}</Text>

                <Text style={{ fontSize: 12, flexBasis: '20%', textAlign: 'right' }}>{formatter({ value: item.price })}</Text>

                <Text style={{ fontSize: 12, flexBasis: '20%', textAlign: 'right' }}>{formatter({ value: item.price * item.quantity })}</Text>
              </View>
            ))
          }
        </View>

        <View style={{ marginTop: 4 }}>
          <Text style={{ fontSize: 16, marginTop: 8, textAlign: 'right' }}>SubTotal: {formatter({ value: subtotal })}</Text>
          <Text style={{ fontSize: 16, marginTop: 8, textAlign: 'right' }}>Iva: 15%</Text>
          <Text style={{ fontSize: 16, marginTop: 8, textAlign: 'right' }}>Total: {formatter({ value: total + subtotal * globalVariables.tax })}</Text>
        </View>
      </View>
    </Page>
  </Document>
);


export const QuoteButton = () => {
  const user = useAuthStore(state => state.user);
  const cartItems = useCartStore(state => state.cartItems);
  const total = useCartStore(state => state.total);
  const tax = useCartStore(state => state.tax);
  const subtotal = useCartStore(state => state.subtotal);
  const [quoteModal, setQuoteModal] = useState(false);
  const [instance, updateInstance] = usePDF();

  useEffect(() => {
    updateInstance(QuoteDocument(
      Object.keys(cartItems).map(cartItemKey => cartItems[cartItemKey as any]),
      { total, subtotal, tax },
      user!
    ));
  }, [cartItems, updateInstance, tax, total, subtotal, user]);

  return (
    <>
      <Button
        variant={'outline'}
        onClick={() => setQuoteModal(true)}
        className='bg-orange-500 text-white font-bold hover:bg-orange-600 hover:text-white'
      >Solicitar cotización</Button>

      <CustomDialog
        isOpen={quoteModal}
        onOpenChange={setQuoteModal}
        title="Cotización"
        className='min-w-[50rem]'
        content={() => (
          <div className="flex flex-col gap-4 w-full min-h-52 min-w-72">
            <embed
              src={instance.url || ''}
              width="100%"
              height="600px"
              type="application/pdf"
              className=' min-w-72'
            />

            <Button
              className='max-w-fit'
              onClick={() => {
                const url = instance.url;
                if (!url) return;
                window.open(url, '_blank');
              }}>
              Descargar Cotización</Button>
          </div>
        )}
      />
    </>
  )
}