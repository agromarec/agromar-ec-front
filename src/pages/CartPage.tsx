import { CartButton } from "@/components/common/CartButton";
import { globalVariables } from "@/config/globalVariables";
import { IProduct } from "@/interfaces/products";
import useCartStore from "@/store/cartStore";


export const CartPage = () => {
  const cartItems = useCartStore(state => state.cartItems);

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl mx-auto text-center font-bold mt-10">Carrito de compras</h1>

      <div className="flex justify-between mt-10 gap-4">
        <div className="flex flex-col gap-4 basis-1/3 border-2 border-gray-300 rounded-lg p-4 flex-1">
          <h2 className="text-2xl font-bold">Productos</h2>
          {
            Object.keys(cartItems).map((cartItemKey: any) => (
              <CartItem cartItem={cartItems[cartItemKey]} />
            ))
          }
        </div>

        <div className="flex flex-col gap-4 basis-1/3 border-2 border-gray-300 rounded-lg p-4 flex-1/2">
          <p className="py-2 px-4 text-center text-sm font-bold bg-orange-500 text-white">Facturación Electrónica</p>
        </div>
      </div>
    </div>
  )
};

const CartItem = ({ cartItem }: { cartItem: IProduct & { quantity: number } }) => {
  return (
    <div>
      <div className="flex gap-4 mt-4">
        <img src={globalVariables.fileUrl + cartItem.image} alt={cartItem.description} width={200} height={200} className="object-cover rounded-lg my-auto" />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">{cartItem.description}</p>

          <div className="flex gap-4 items-center">
            <p className="font-bold">Precio Unitario:</p>
            <p className="text-sm">{cartItem.price}</p>

            <p className="font-bold">Stock:</p>
            <p className="text-sm">{cartItem.stock}</p>
          </div>

          <div className="flex-1" />

          <div className="mb-2 w-28">
            <CartButton product={cartItem} type="ghost" />
          </div>
        </div>
      </div>

      <div className="border-t-2 border-gray-300 flex justify-between items-center mt-2" />
    </div>
  )
}
