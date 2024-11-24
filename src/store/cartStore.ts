import { AgroMarApi } from "@/api/AgroMarApi";
import { to } from "@/helpers";
import { ICartResponse } from "@/interfaces/cart";
import { IProduct } from "@/interfaces/products";
import { AxiosResponse } from "axios";
import { create } from "zustand";

interface CartStore {
  cartItems: Record<number, IProduct & { quantity: number }>;
  count: number;
  tax: number;
  subtotal: number;
  total: number;

  loadCart: () => Promise<void>;

  addToCart: (product: IProduct, quantity: number) => Promise<boolean>;

  removeFromCart: (id: number) => void;
}

const useCartStore = create<CartStore>()((set) => ({
  cartItems: {},
  tax: 0.15,
  subtotal: 0,
  total: 0,
  count: 0,

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
      cartItems,
      count: cart.cart_item.length,
      subtotal: cart.total,
      total: cart.total,
    }));
  },

  addToCart: async (product, quantity) => {
    const [, error] = await to<AxiosResponse<ICartResponse>>(AgroMarApi.patch('/cart', {
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

      return {
        cartItems,
        subtotal: state.subtotal + product.price * quantity,
        total: state.total + product.price * quantity,
        count: Object.keys(cartItems).length,
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
}));


export default useCartStore;