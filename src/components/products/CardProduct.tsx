import { IProduct } from "@/interfaces/products";
import { Badge } from "../ui/badge";
import { formatter } from "@/helpers";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { globalVariables } from "@/config/globalVariables";
import { CartButton } from "../common/CartButton";

interface CardProductProps {
  product: IProduct;
  onOpenDetails: (product: IProduct) => void;
}

export const CardProduct = ({ product, onOpenDetails }: CardProductProps) => {
  return (
    <div className="flex flex-col rounded-lg max-w-[350px] min-w-[350px] shadow-lg h-[500px] overflow-hidden">

      <div className="relative max-h-[350px] overflow-hidden">
        <img src={`${globalVariables.fileUrl}${product.image}`} alt={product.predefinedProduct.name} width={350} className="object-cover rounded-lg rounded-b-none h-[280px] hover:scale-105 transition-transform" />

        <Badge className="bg-indigo-500 absolute bottom-2 left-2">{product.predefinedProduct.category.name}</Badge>
      </div>

      <div className="px-2 flex flex-col gap-2 justify-between mt-1">
        <p className="text-xl font-bold overflow-hidden text-ellipsis line-clamp-1">{product.predefinedProduct.name}</p>
        <p className="overflow-hidden text-ellipsis line-clamp-2">{product.description}</p>
        <p><span className="font-bold">Stock:</span> {product.stock}</p>
        <p className="text-xl font-bold">{formatter({ value: product.price })}</p>
      </div>

      <div className="flex mt-auto justify-center gap-8 items-center pb-2">
        <Button variant="ghost" size="icon" className="[&_svg]:size-6" onClick={() => onOpenDetails(product)}>
          <Eye size={24} width={'3rem'} height={'3rem'} />
        </Button>

        <CartButton product={product} type="ghost" />
      </div>
    </div>
  )
};
