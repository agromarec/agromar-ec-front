import { Spinner } from "@/components/common/Spinner";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useNearScreen } from "@/hooks/useNearScreen";
import { IUserSearch } from "@/interfaces/users";
import useCartStore from "@/store/cartStore";
import { Building, ChevronRight, Landmark, Mail, MapPinHouse, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const UserType: { [key: string]: string } = {
  cliente: 'Cliente',
  empresa: 'Empresa',
  gobierno: 'Gobierno',
}


export const UsersSearchPage = () => {
  const params = useParams();
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 350);
  const { isVisible, ref } = useNearScreen();
  const { data, refetch, loading } = useFetch<{ hasMore: boolean, data: IUserSearch[] }>(`/users/getByType/${params.userType}`);
  const [users, setUsers] = useState<IUserSearch[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (loading) return;
    const path = `/users/getByType/${params.userType}`;
    const searchParams = new URLSearchParams({ search: debounceValue, page: page.toString() });

    if (!debounceValue.length) searchParams.delete('search');

    const url = `${path}?${searchParams.toString()}`;

    refetch(url);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, refetch, params.userType, page]);

  useEffect(() => {
    if (!data?.hasMore) return;
    if (isVisible) setPage(page => page + 1);
  }, [isVisible, data?.hasMore]);

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
    }
  }, [data]);


  return (
    <div className="mb-12">
      {
        params.userType && (
          <h1 className="text-center text-4xl font-bold mt-14 capitalize">
            Encuentra {UserType[params.userType] === 'Cliente' ? 'el' : 'la'} {UserType[params.userType]} que necesitas
            </h1>
        )
      }

      <div className="max-w-3xl mx-auto mt-10">
        <Input
          className="w-full p-8 border border-gray-300 rounded-full text-xl"
          placeholder="Buscar por nombre, dirección, email o número de teléfono"
          onChange={({ target }) => setSearchValue(target.value)}
          value={searchValue}
        />
      </div>

      <Spinner isLoading={loading} />

      <div className="flex flex-col items-center justify-center mt-10 gap-8">
        {
          users?.map(item => (
            <UserCard key={item.id} item={item} />
          ))
        }

        <div
          ref={ref}
          className={`flex justify-center items-center h-1 `}
        />
      </div>
    </div>

  )
};


export const UserCard = ({ item }: { item: IUserSearch }) => {
  const emptyCartAsync = useCartStore(state => state.emptyCartAsync);
  const isLoadingCart = useCartStore(state => state.isLoadingCart);
  const params = useParams();
  const navigate = useNavigate();

  const handleUserSelect = async () => {
    // empty cart items
    await emptyCartAsync();
    navigate(`/productos/${item.id}`);
  }

  return (
    <div className="flex flex-col w-full hover:cursor-pointer max-w-[800px] mx-auto rounded-lg hover:bg-gray-100 p-4 border border-gray-300"
      onClick={handleUserSelect}
    >
      {
        isLoadingCart && (
          <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center bg-gray-100 opacity-50">
            <Spinner isLoading={true} />
          </div>
        )
      }

      <div className="flex items-center justify-center gap-4 w-full">
        {/* {
          item.image ?
            (
              <div className="min-w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <img src={item.image} alt={item.name} />
              </div>
            ) : 
            ( */}
              <div className="min-w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                {
                  params.userType === 'empresa' ? (
                    <Building className="text-gray-500 min-w-12 h-12" />
                  ) : params.userType === 'cliente' ? (
                    <User className="text-gray-500 min-w-12 h-12" />
                  ) : (
                    <Landmark className="text-gray-500 min-w-12 h-12" />
                  )
                }
              </div>
            {/* )
        } */}

        <div className="flex-1">
          <p className="text-xl font-semibold">{item.name} {item.lastName}</p>
          <p>{item.businessDescription}</p>
        </div>

        <ChevronRight className="text-gray-500 min-w-6 h-6" />
      </div>

      <div className="flex ml-auto gap-4 items-center">
        <div className="flex items-center justify-center gap-1 ">
          <MapPinHouse className="text-gray-500 min-w-4 h-4" />
          {/* address */}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={`https://www.google.com/maps/search/?api=1&query=${item.address}`} className="text-gray-500 hover:underline text-sm"
          >
            {item.address}
          </a>
        </div>

        <div className="flex items-center justify-center gap-1 ">
          <Mail className="text-gray-500 min-w-4 h-4" />
          {/* mail */}
          <a href={`mailto:${item.email}`} className="text-gray-500 hover:underline text-sm">
            {item.email}
          </a>
        </div>

        <div className="flex items-center justify-center">
          <Phone className="text-gray-500 min-w-4 h-4" />
          <a href={`tel:${item.phone}`} className="text-gray-500 hover:underline text-sm">
            {item.phone}
          </a>
        </div>
      </div>
    </div>
  )
};
