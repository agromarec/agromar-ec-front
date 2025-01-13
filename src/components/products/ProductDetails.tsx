import { IProduct } from "@/interfaces/products";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { formatter, to } from "@/helpers";
import { Button } from "../ui/button";
import { Send, Trash2 } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { globalVariables } from "@/config/globalVariables";
import { CartButton } from "../common/CartButton";
import { useFetch } from "@/hooks";
import { ICommentResponse } from "@/interfaces/comments";
import { AgroMarApi } from "@/api/AgroMarApi";
import { useRef, useState } from 'react';
import { toast } from "sonner";
import { LoaderBtn } from "../ui/LoaderBtn";
import { useNavigate } from "react-router";

interface ProductDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct;
}

export const ProductDetails = ({ isOpen, onClose, product }: ProductDetailsProps) => {
  const user = useAuthStore(state => state.user);
  const authStatus = useAuthStore(state => state.status);
  const navigate = useNavigate();
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
              <img src={!product.image ? '/no-image.png' : `${globalVariables.fileUrl}${product.image}`} alt={product.predefinedProduct.name} width={400} className="object-cover rounded-lg h-[280px] my-auto" />
              {/* </div> */}

              <DialogDescription className="flex h-full text-black w-full gap-4">
                <div className="flex flex-col justify-between h-full basis-[40%]">
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
                      onClick={async () => {
                        if (authStatus === 'unauthenticated') return onOpenLoginModal();
                        if(product.seller_id === Number(user?.id)) return toast.error('No puedes crear un chat contigo mismo');
                        const [, error] = await to(AgroMarApi.post('/chat/create-chat', { emisorId: product.seller_id }));
                        if (error) return toast.error(error.message);
                        navigate('/chat');
                      }}
                    >¿Tienes dudas? Escríbenos</Button>

                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                  </div>
                </div>


                <CommentsForm productId={product.id} />
              </DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
};


export const CommentsForm = ({ productId }: { productId: number }) => {
  const { data, refetch } = useFetch<ICommentResponse[]>(`/comments?productId=${productId}`);
  const authStatus = useAuthStore(state => state.status);
  const onOpenLoginModal = useAuthStore(state => state.onOpen);
  const [comment, setComment] = useState('');
  const commentBoxRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col justify-start h-full gap-2 flex-1">
      <p className="font-bold text-lg">Comentarios</p>
      <div ref={commentBoxRef} className="h-full border-primary-400 border-2 shadow-sm rounded-lg px-2 py-2 max-h-72 overflow-y-auto">
        {
          data?.map(comment => (
            <div className="flex gap-2 flex-col mb-4 relative" key={comment.id_comment}>
              <div className="flex gap-1 items-center">
                <p>{comment.user_ce.name} {comment.user_ce.lastName}</p>
                <p className="capitalize">{formatter({ as: 'date', date: new Date(comment.creation_date), dateStyle: 'full', timeStyle: 'short', language: 'es' })}</p>
              </div>

              <div className="flex gap-2 items-center justify-between">
                <p>{comment.comentario}</p>

                <Button variant="ghost" className="min-h-4 h-fit" onClick={async () => {
                    setLoading(true);
                    const [, error] = await to(AgroMarApi.delete(`/comments/${comment.id_comment}`));
                    if (error) return toast.error(error.message);
                    await refetch();
                    setLoading(false);
                  }}>
                  <Trash2 className="text-rose-400"  />
                </Button>
              </div>

              <div className="border-t-2 border-gray-300 flex justify-between items-center mt-2" />
            </div>
          ))
        }
      </div>

      <Textarea className="resize-none h-1/6 w-full" placeholder="Escribe aquí tu comentario"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <LoaderBtn
        isLoading={loading}
        onClick={async () => {
          if(comment.trim().length === 0) return toast.error('El comentario no puede estar vacío');
          if (authStatus === 'unauthenticated') return onOpenLoginModal();
          setLoading(true);
          const [, error] = await to(AgroMarApi.post('/comments', { product_id: productId, comentario: comment }));
          if (error) return toast.error(error.message);
          setComment('');
          await refetch();
          commentBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
          setLoading(false);
        }}
      >
        <div className="flex gap-2 items-center">
          Enviar
          <Send />
        </div>
      </LoaderBtn>
      {/* <Button

      >
      </Button> */}
    </div>
  )
};

