import { useFetch } from "@/hooks";
import { IUserSearch } from "@/interfaces/users";
import { Building, ChevronRight, Landmark, Mail, MapPinHouse, Phone, User } from "lucide-react";
import { useParams } from "react-router";


export const UsersSearchPage = () => {
  const params = useParams();
  const { data } = useFetch<IUserSearch[]>(`/users/getByType/${params.userType}`);

  console.log({ data });

  return (
    <div className="mb-12">
      <h1 className="text-center text-4xl font-bold mt-14">Encuentra la empresa de tu preferencia</h1>

      <div className="flex flex-col items-center justify-center mt-10 gap-8">
        {
          data?.map(item => (
            <div className="flex flex-col w-full hover:cursor-pointer max-w-[800px] mx-auto rounded-lg hover:bg-gray-100 p-4 border border-gray-300">
              <div key={item.id} className="flex items-center justify-center gap-4 w-full">
                {
                  item.image ?
                    (
                      <div className="min-w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                        <img src={item.image} alt={item.name} />
                      </div>
                    ) : (
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
                    )
                }

                <div>
                  <p className="text-xl font-semibold">{item.name} {item.lastName}</p>
                  <p>Nostrud laborum nostrud esse nisi labore in fugiat mollit tempor. Nisi laboris reprehenderit proident incididunt ipsum fugiat incididunt enim quis magna do. Ad aute in dolor ut anim id adipisicing nisi non est sint.</p>
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
          ))
        }
      </div>
    </div>

  )
};
