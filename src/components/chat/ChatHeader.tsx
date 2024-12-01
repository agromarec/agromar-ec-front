import useChatStore from "@/store/chatStore";
import { CircleUser } from "lucide-react";


export const ChatHeader = () => {
  const chatingWith = useChatStore(state => state.chatingWith);

  return (
    // <div className="flex gap-2 items-center px-4 py-2 border-b-2 bg-gray-200 min-h-20">
    <div className="flex gap-2 items-center px-4 py-2 border-b-2 bg-gray-200">
      <div className="flex items-center gap-2">
        <CircleUser className="text-white h-12 min-w-12 bg-gray-600 rounded-full max-w-fit" />
        {
          chatingWith ? (
            <p className="text-lg capitalize font-semibold">{chatingWith.name} {chatingWith.lastName}</p>
          ) : (
            <p>Selecciona un usuario para empezar a chatear</p>
          )
        }
      </div>
    </div>
  )
};
