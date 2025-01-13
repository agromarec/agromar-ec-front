import { ProductList } from "@/components";
import { Spinner } from "@/components/common/Spinner";
import { useFetch } from "@/hooks";
import { IProductResponse } from "@/interfaces/products";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";


export const ProductsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch<IProductResponse>(`/products/seller/${userId}`);

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

  return (
    <div>
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
