import { ProductList } from "@/components";
import { useFetch } from "@/hooks";


export const ProductsPage = () => {
  const { data, loading, error } = useFetch<any>('/products');

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <ProductList data={data} />
    </div>
  )
};
