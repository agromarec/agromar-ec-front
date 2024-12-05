import { AgroMarApi } from "@/api/AgroMarApi";
import { to } from "@/helpers";
import { toast } from "sonner";
import { create } from "zustand";

export interface ChatUser {
  name: string;
  id: bigint;
  lastName: string;
  phone: string;
  isOnline: boolean;
};

interface ChatMessage {
  id: string | number;
  isMe: boolean;
  message: string;
  createdAt: Date;
}

interface ChatStore {
  chatUsers: Record<number, ChatUser>;
  chatingWith: ChatUser | null;

  chatMessages: ChatMessage[];

  // addUser: (user: IUserResponse) => void;
  // removeUser: (id: number) => void;
  loadChatUsers: (data: ChatUser[]) => void;
  loadChatMessages: () => void;
  setChatingWith: (id: ChatUser | null) => void;
  createMessage: (values: { message: string, isMe: boolean }) => void;
  onUserConnect: (values: { userId: number, isOnline?: boolean }) => void;
}

const useChatStore = create<ChatStore>()((set, get) => ({
  chatUsers: {},
  chatingWith: null,
  chatMessages: [],

  loadChatUsers: async (data: ChatUser[]) => {
    set({ chatUsers: data.reduce((acc, user) => ({ ...acc, [Number(user.id)]: user }), {}) });
  },

  loadChatMessages: async () => {
    const { chatingWith } = get();
    if (!chatingWith) return;

    const [response, error] = await to(AgroMarApi.get(`/chat/messages/${chatingWith.id}`));

    if (error) return toast.error('Error al cargar mensajes del chat');

    set({ chatMessages: response.data });
  },

  setChatingWith: (id: ChatUser | null) => set({ chatingWith: id }),

  createMessage: ({ isMe, message }) => {
    set(state =>
      !state.chatingWith ? state :
        ({
          chatMessages: [
            { isMe, message, createdAt: new Date(), id: Date.now() },
            ...state.chatMessages,
          ],
        })
    );
  },

  onUserConnect: ({ userId, isOnline = true }) => {
    set(state => ({
      ...state,
      chatUsers: {
        ...state.chatUsers,
        [userId]: {
          ...state.chatUsers[userId],
          isOnline,
        },
      },
    }));
  },
}));


export default useChatStore;