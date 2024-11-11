import { IProduct, IProductResponse } from "@/interfaces/products";
import { Button } from "../ui/button";
import { CardProduct } from './CardProduct';
import { useDisclousure } from "@/hooks";
import { ProductDetails } from "./ProductDetails";
import { useRef } from "react";

interface ProductListProps {
  data: IProductResponse;
}

export const ProductList = ({ data }: ProductListProps) => {
  const { isOpen, toggleDisclosure } = useDisclousure();
  const productRef = useRef<IProduct|null>(null);

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center mt-16 after:bg-[#84E3F0] after:w-20 after:h-1 after:block after:mx-auto after:mt-2 after:content-['']">Productos</h1>

      <div className="flex flex-wrap justify-center gap-12 items-center mt-4">
        <Button variant="default" disabled={data.currentPage === 1}>
          Anterior
        </Button>

        <p>Página {data.currentPage} de {data.totalPages}</p>

        <Button variant="default" disabled={!data.hasMore}>
          Siguiente
        </Button>
      </div>


      <div className="flex items-center mt-8 px-10 basis-1/3 gap-4 flex-wrap my-12 gap-y-6">
        {
          data.products.map((product) => (
            <CardProduct
              key={product.id}
              product={product}
              onOpenDetails={(product) => {
                productRef.current = product;
                toggleDisclosure();
              }}
              onAddToCart={console.log}
            />
          ))
        }
      </div>

      <ProductDetails 
        isOpen={isOpen}
        onClose={toggleDisclosure}
        product={productRef.current!}
      />
    </div>
  )
};
