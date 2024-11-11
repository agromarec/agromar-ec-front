import { useFetch } from "@/hooks";


export const AdminCategoriesPage = () => {
  const { data } = useFetch<any>('/users');

  console.log({data});
  

  return (
    <div>
      
    </div>
  )
};
