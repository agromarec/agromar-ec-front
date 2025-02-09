import { ProductList } from "@/components";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useFetch } from "@/hooks";
import { IProductCategory } from "@/interfaces/predifined-product";
import { IProductResponse } from "@/interfaces/products";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useState } from 'react';
import { IPredifinedProductResponse } from '../interfaces/predifined-product';


export const ProductsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch<IProductResponse>(`/products/seller/${userId}`);
  const categories = useFetch<IProductCategory[]>(`/product-categories`);
  const predifinedProducts = useFetch<IPredifinedProductResponse[]>(`/predefined-product`);
  const [appliedCategories, setAppliedCategories] = useState<number[]>([]);
  const [appliedPredifinedProducts, setAppliedPredifinedProducts] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <Spinner isLoading={loading} />
    )
  }

  if (error) {
    navigate('/');
    toast.error('Error al cargar productos', { position: 'top-right' });
    return <></>
  }

  const handleNextPage = async (page: number) => {
    refetch(`/products/seller/${userId}?page=${page}`);
  }

  const handlePreviousPage = async (page: number) => {
    refetch(`/products/seller/${userId}?page=${page}`);
  }

  const onApplyFilters = (shouldApplyFilters = true) => {
    setIsOpen(false);

    if (!shouldApplyFilters) return refetch(`/products/seller/${userId}`);

    const params = new URLSearchParams();
    params.set('category', appliedCategories.join(','));
    params.set('predefinedProduct', appliedPredifinedProducts.join(','));

    refetch(`/products/seller/${userId}?${params.toString()}`);
  }

  return (
    <div className="relative">

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          className="absolute top-0 right-28"
          onClick={() => setIsOpen(true)}
        >
          <Button className="min-w-[100px]">Filtros</Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle
              className="border-b-[1px] border-primary"
            >Filtros disponibles</SheetTitle>
            <SheetDescription className="h-full">
              <div className="flex flex-col h-full">
                <p
                  className="text-lg font-bold text-center mt-4 mb-2"
                >Producto Padre</p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {
                    predifinedProducts.data?.map(predifinedProduct => (
                      <Button
                        key={predifinedProduct.id}
                        className={`
                          ${appliedPredifinedProducts.includes(predifinedProduct.id) ? 'bg-primary text-white' : 'bg-white text-primary'}
                          rounded-lg
                          px-4 py-2
                          text-xs
                          font-bold
                          hover:bg-primary hover:text-white
                          border-[1px]
                          border-primary
                          overflow-hidden text-ellipsis
                        `}
                        onClick={() => {
                          const res = appliedPredifinedProducts.includes(predifinedProduct.id) ? appliedPredifinedProducts.filter(id => id !== predifinedProduct.id) : [...appliedPredifinedProducts, predifinedProduct.id];
                          setAppliedPredifinedProducts(res)
                        }}>{predifinedProduct.name}</Button>
                    ))
                  }
                </div>


                <p
                  className="text-lg font-bold text-center mt-8 mb-2"
                >Categorías</p>

                <div className="flex flex-wrap justify-center gap-4 items-center mt-4">
                  {
                    categories.data?.map(category => (
                      <Button
                        key={category.id}
                        className={`
                          ${appliedCategories.includes(category.id) ? 'bg-primary text-white' : 'bg-white text-primary'}
                          rounded-lg
                          px-4 py-2
                          text-sm
                          font-bold
                          hover:bg-primary hover:text-white
                          flex-1
                          border-[1px]
                          border-primary
                        `}
                        onClick={() => {
                          const res = appliedCategories.includes(category.id) ? appliedCategories.filter(id => id !== category.id) : [...appliedCategories, category.id];
                          setAppliedCategories(res)
                        }}>{category.name}</Button>
                    ))
                  }
                </div>
              </div>

            </SheetDescription>
          </SheetHeader>

          <div className="flex-1" />

          <div className="flex justify-between items-center gap-x-4 mt-auto">
            <Button className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold flex-1"
              onClick={() => onApplyFilters()}
            >Aplicar filtros</Button>

            <Button
              className="flex-1"
              variant={'secondary'}
              onClick={() => {
                setAppliedCategories([]);
                setAppliedPredifinedProducts([]);
                onApplyFilters(false);
              }}
            >Limpiar filtros</Button>
          </div>
        </SheetContent>
      </Sheet>

      {
        !!data &&
        <ProductList
          data={data}
          onNext={handleNextPage}
          onPrevious={handlePreviousPage}
        />
      }
    </div>
  )
};
