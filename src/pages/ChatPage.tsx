import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import useChatStore, { ChatUser } from "@/store/chatStore";
import { CircleUser } from "lucide-react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatForm } from "@/components/chat/ChatForm";
import useAuthStore from "@/store/auht";

export const ChatPage = () => {
  const user = useAuthStore(state => state.user);
  const { on, emit } = useSocket({ url: 'http://localhost:3001/' });
  const loadChatUsers = useChatStore(state => state.loadChatUsers);
  const sendMessage = useChatStore(state => state.sendMessage);

  useEffect(() => {
    on('personal-message', (data: string) => {
      console.log('Recibido:', data);
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    on('conection', (data: string) => {
      console.log(`Usuario con id: ${data} se ha =>`, { data });
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    on('load-chat-users', (data: ChatUser[]) => {
      loadChatUsers(data);
    });
    // eslint-disable-next-line
  }, []);

  const onSubmit = (to: number, msg: string) => {
    if (!user) return;
    sendMessage(msg);
    // emit('personal-message', {
    //   from: user.id,
    //   to,
    //   message: msg,
    // });
  };


  return (
    <div className="flex">
      <ChatUsersView />
      <div className="grid grid-rows-[0.43fr_4fr_0.5fr] flex-1">
        <ChatHeader />
        <ChatMessages />
        <ChatForm onSubmit={onSubmit} />
      </div>
    </div>
  )
};

const ChatUsersView = () => {
  const chatUsers = useChatStore(state => state.chatUsers);

  return (
    <div className="flex flex-col gap-2 basis-1/4 bg-gray-200 h-[calc(100dvh-3rem)]">
      {
        Object.values(chatUsers).map(user => (
          <UserCard user={user} />
        ))
      }
    </div>
  )
};

const UserCard = ({ user }: { user: ChatUser }) => {
  const setChatingWith = useChatStore(state => state.setChatingWith);

  return (
    <div
      className={`flex h-20 overflow-hidden gap-2 items-center p-2 border-b-2 border-gray-300 w-ful hover:bg-gray-300 cursor-pointer active:bg-gray-200`}
      onClick={() => setChatingWith(user)}
    >
      <CircleUser className="text-white h-12 min-w-12 bg-gray-600 rounded-full max-w-fit" />
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-lg capitalize">{user.name} {user.lastName}</p>
        <div className="flex gap-2 items-center">
          <p className="text-sm text-gray-500">{user.isOnline ? 'En línea' : 'Desconectado'}</p>
          <span
            className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-red-500'}`}
          />
        </div>
      </div>
    </div>
  )
};
