import { AgroMarApi } from "@/api/AgroMarApi";
import { globalVariables } from "@/config/globalVariables";
import { to } from "@/helpers";
import { ICartResponse } from "@/interfaces/cart";
import { IProduct } from "@/interfaces/products";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { create } from "zustand";

interface CartStore {
  cartId: number | null;
  cartItems: Record<number, IProduct & { quantity: number }>;
  isLoadingCart: boolean;
  count: number;
  tax: number;
  subtotal: number;
  total: number;

  loadCart: () => Promise<void>;
  addToCart: (product: IProduct, quantity: number) => Promise<boolean>;
  removeFromCart: (id: number) => void;
  emptyCartAsync: () => Promise<void>;
  emptyCart: () => void;
}

const useCartStore = create<CartStore>()((set, get) => ({
  cartItems: {},
  tax: globalVariables.tax,
  subtotal: 0,
  total: 0,
  count: 0,
  cartId: null,
  isLoadingCart: false,

  loadCart: async () => {
    const [response, error] = await to<AxiosResponse<ICartResponse>>(AgroMarApi.get('/cart'));

    if (error) {
      return;
    }

    const cart = response.data;

    const cartItems = cart.cart_item.reduce((acc, item) => {
      return {
        ...acc,
        [item.product_id]: {
          ...item.product,
          quantity: item.quantity,
        },
      };
    }, {});


    set(() => ({
      cartId: cart.id_shopping_cart,
      cartItems,
      count: cart.cart_item.length,
      subtotal: cart.total,
      total: cart.total,
    }));
  },

  addToCart: async (product, quantity) => {
    const [data, error] = await to<AxiosResponse<ICartResponse>>(AgroMarApi.patch('/cart', {
      productId: product.id,
      quantity,
    }));

    if (error) {
      return false;
    }

    set(state => {
      if (quantity === 0) {
        // eslint-disable-next-line
        const { [product.id]: _, ...rest } = state.cartItems;
        return {
          cartItems: rest,
          count: Object.keys(rest).length,
        }
      }

      const cartItems = {
        ...state.cartItems,
        [product.id]: {
          ...product,
          quantity,
        },
      }

      const subtotal = Object.keys(cartItems).reduce((acc, item: any) => acc + cartItems[item].price * cartItems[item].quantity, 0);
      const total = (subtotal * state.tax) + subtotal;

      return {
        cartItems,
        subtotal,
        total,
        count: Object.keys(cartItems).length,
        cartId: data.data.id_shopping_cart
      }
    });

    return true;
  },

  removeFromCart: (id) => {
    set(state => {
      // eslint-disable-next-line
      const { [id]: _, ...rest } = state.cartItems;
      return {
        cartItems: rest,
      }
    });
  },

  emptyCartAsync: async () => {
    set(state => ({
      ...state,
      isLoadingCart: true,
    }))

    const cartId = get().cartId;
    if (!cartId) {
      set(state => ({
        ...state,
        isLoadingCart: false,
      }));
      return;
    }

    const [, error] = await to(AgroMarApi.delete(`/cart/${cartId}`));
    if (error) {
      toast.error(error.message);
      return;
    }

    set(() => ({
      cartItems: {},
      cartId: null,
      count: 0,
      subtotal: 0,
      total: 0,
      tax: 0.15,
      isLoadingCart: false
    }));

    toast.success('Carrito vaciado');
  },

  emptyCart: () => {
    set(() => ({
      cartItems: {},
      count: 0,
      subtotal: 0,
      total: 0,
    }));
  },
}));


export default useCartStore;