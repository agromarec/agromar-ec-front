import useAuthStore from "@/store/auht";
import { Button } from "../ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import useCartStore from "@/store/cartStore";
import { useState, useEffect, useRef } from 'react';
import { IProduct } from "@/interfaces/products";
import { toast } from "sonner";

interface CartButtonProps {
  type?: 'solid' | 'ghost'
  product: IProduct;
}

let timer: NodeJS.Timeout;
const debounce = (func: () => void, delay: number) => {
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func();
    }, delay);
  };
};

export const CartButton = ({ product, type = 'ghost' }: CartButtonProps) => {
  const status = useAuthStore(state => state.status);
  const onOpenAuthModal = useAuthStore(state => state.onOpen);

  return (
    <div>
      {
        status === 'authenticated' ? (
          <CartButtonAction product={product} type={type} />
        ) : (
          <>
            {
              type === 'ghost' ? (
                <Button variant="ghost" size="icon" className="[&_svg]:size-6" onClick={() => onOpenAuthModal()}>
                  <ShoppingCart size={20} strokeWidth={2} />
                </Button>
              ) : (
                <Button variant="default" size="icon" className="[&_svg]:size-6 w-full" onClick={() => onOpenAuthModal()}>
                  Agregar al carrito <ShoppingCart size={20} strokeWidth={2} />
                </Button>
              )
            }
          </>
        )
      }
    </div>
  )
};

export const CartButtonAction = ({ product, type }: CartButtonProps) => {
  const cartItem = useCartStore(state => state.cartItems[product.id]);
  const addToCart = useCartStore(state => state.addToCart);
  const oldQuantityRef = useRef<number>(0);

  const [counter, setCounter] = useState(cartItem?.quantity ?? 0);

  useEffect(() => {
    setCounter(cartItem?.quantity ?? 0);
    oldQuantityRef.current = cartItem?.quantity ?? 0;
  }, [cartItem?.quantity]);


  const onAddToCart = (quantity: number = 1) => {
    if (product.stock < counter + quantity) return;
    setCounter(counter + quantity);

    debounce(async () => {
      const result = await addToCart(product, counter + quantity);
      if (!result) {
        setCounter(oldQuantityRef.current);
        return toast.error('Ocurrió un error al añadir al carrito');
      }
      oldQuantityRef.current = counter + quantity;
    }, 500)();
  }

  return (
    <>
      {
        counter <= 0 ? (
          <>
            {
              type === 'ghost' ? (
                <Button variant="ghost" size="icon" className="[&_svg]:size-6" onClick={() => onAddToCart()}>
                  <ShoppingCart size={20} strokeWidth={2} />
                </Button>
              ) : (
                <Button variant="default" size="icon" className="[&_svg]:size-6 w-full" onClick={() => onAddToCart()}>
                  Agregar al carrito <ShoppingCart size={20} strokeWidth={2} />
                </Button>
              )
            }
          </>
        ) : (
          <div className="flex gap-4 items-center justify-between max-w-56 mx-auto">
            <Button variant="default" className="rounded-full max-w-6 max-h-6 overflow-hidden px-1" onClick={() => onAddToCart(-1)}>
              <Minus width={4} height={4} />
            </Button>
            <p className="text-xl font-bold">{counter}</p>

            <Button variant="default" className="rounded-full max-w-6 max-h-6 px-1" onClick={() => onAddToCart(1)} disabled={product.stock <= counter}>
              <Plus />
            </Button>
          </div>
        )
      }
    </>
  )
};

