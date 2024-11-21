import { IProduct } from "@/interfaces/products";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { formatter } from "@/helpers";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import useAuthStore from "@/store/auht";
import { globalVariables } from "@/config/globalVariables";
import { CartButton } from "../common/CartButton";

interface ProductDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct;
}

export const ProductDetails = ({ isOpen, onClose, product }: ProductDetailsProps) => {
  const authStatus = useAuthStore(state => state.status);
  const onOpenLoginModal = useAuthStore(state => state.onOpen);

  if (!product) return null;

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={'max-w-6xl w-full h-[40rem]'}>
          <DialogHeader>
            <DialogTitle>{product.predefinedProduct.name}</DialogTitle>

            <div className="flex gap-4 h-full py-12">
              {/* <div className="my-auto"> */}
              <img src={globalVariables.fileUrl + product.image} alt={product.predefinedProduct.name} width={400} className="object-cover rounded-lg h-[280px] my-auto" />
              {/* </div> */}

              <DialogDescription className="flex h-full text-black w-full gap-4">
                <div className="flex flex-col justify-between h-full flex-1">
                  <div>
                    <p className="font-bold text-2xl">Descripción</p>
                    <p className="text-sm mt-2">{product.description}</p>
                  </div>

                  <div>
                    <div className="flex gap-4 mt-4 items-center">
                      <p className="font-bold text-lg">Precio:</p>
                      <p className="text-sm">{formatter({ value: product.price })}</p>
                    </div>

                    <div className="flex gap-4 mt-2 items-center">
                      <p className="font-bold text-lg">Stock:</p>
                      <p className="text-sm">{product.stock}</p>
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-3 mt-4">
                    <CartButton product={product} type="solid" />

                    <Button variant="outline"
                      onClick={() => {
                        if (authStatus === 'unauthenticated') return onOpenLoginModal();
                        console.log('Enviar');
                      }}
                    >¿Tienes dudas? Escribenos</Button>

                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                  </div>
                </div>

                <div className="flex flex-col justify-start h-full gap-2 flex-1">
                  <p className="font-bold text-lg">Comentarios</p>
                  <div className="h-full border-primary-400 border-2 shadow-sm rounded-lg"></div>
                  <Textarea className="resize-none h-1/6 w-full" placeholder="Escribe aquí tu comentario" />

                  <Button variant="default"
                    onClick={() => {
                      if (authStatus === 'unauthenticated') return onOpenLoginModal();
                      console.log('Enviar');
                    }}
                  >
                    Enviar
                    <Send />
                  </Button>
                </div>
              </DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
};
