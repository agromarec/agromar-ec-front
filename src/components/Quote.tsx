import { Page, Text, View, Document, StyleSheet, usePDF, Image } from '@react-pdf/renderer';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { CustomDialog } from './ui/CustomDialog';
import useCartStore from '@/store/cartStore';
import { IProduct } from '@/interfaces/products';
import { formatter } from '@/helpers';
import { globalVariables } from '@/config/globalVariables';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  section: {
    margin: 10,
    padding: 10,
  }
});

// Create Document Component
const QuoteDocument = (cartItems: (IProduct & { quantity: number; })[],  { total, subtotal }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ flexDirection: 'column', width: '100%', paddingHorizontal: 40 }}>
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cotización</Text>
            <Image src={'/logo.jpeg'} style={{ width: 140, height: 50 }} />
          </View>
        </View>

        <View style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginBottom: 4
        }}>
          <Text style={{ fontSize: 10, flexBasis: '50%', textAlign: 'left' }}>Nombre</Text>
          <Text style={{ fontSize: 10, flexBasis: '10%', textAlign: 'right' }}>Cantidad</Text>
          <Text style={{ fontSize: 10, flexBasis: '20%', textAlign: 'right' }}>Precio Unitario</Text>
          <Text style={{ fontSize: 10, flexBasis: '20%', textAlign: 'right' }}>Total</Text>
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
  const cartItems = useCartStore(state => state.cartItems);
  const total = useCartStore(state => state.total);
  const tax = useCartStore(state => state.tax);
  const subtotal = useCartStore(state => state.subtotal);
  const [quoteModal, setQuoteModal] = useState(false);
  const [instance, updateInstance] = usePDF();

  useEffect(() => {
    updateInstance(QuoteDocument(
      Object.keys(cartItems).map(cartItemKey => cartItems[cartItemKey as any]),
      { total, subtotal, tax }
    ));
  }, [cartItems, updateInstance, tax, total, subtotal]);

  return (
    <>
      <Button
        variant={'outline'}
        onClick={() => setQuoteModal(true)}
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
                if(!url) return;
                window.open(url, '_blank');
              }}>
              Descargar Cotización</Button>
          </div>
        )}
      />
    </>
  )
}