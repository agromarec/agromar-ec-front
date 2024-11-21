import { ProductList } from "@/components";
import { Spinner } from "@/components/common/Spinner";
import { useFetch } from "@/hooks";
import { IProductResponse } from "@/interfaces/products";


export const ProductsPage = () => {
  const { data, loading, error } = useFetch<IProductResponse>('/products');

  if (loading) {
    return (
      <Spinner isLoading={loading} />
    )
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {
        !!data &&
        <ProductList data={data} />
      }
    </div>
  )
};
