import { create } from "zustand";

export interface ChatUser {
  name: string;
  id: bigint;
  lastName: string;
  phone: string;
  isOnline: boolean;
};

interface ChatMessage {
  isMe: boolean;
  message: string;
}

interface ChatStore {
  chatUsers: Record<number, ChatUser>;
  chatingWith: ChatUser | null;

  chatMessages: ChatMessage[];

  // addUser: (user: IUserResponse) => void;
  // removeUser: (id: number) => void;
  loadChatUsers: (data: ChatUser[]) => void;
  setChatingWith: (id: ChatUser | null) => void;
  sendMessage: (message: string) => void;
}

const useChatStore = create<ChatStore>()((set) => ({
  chatUsers: {},
  chatingWith: null,
  chatMessages: [],

  loadChatUsers: async (data: ChatUser[]) => {
    set({ chatUsers: data.reduce((acc, user) => ({ ...acc, [Number(user.id)]: user }), {}) });
  },

  setChatingWith: (id: ChatUser | null) => set({ chatingWith: id }),

  sendMessage: (message: string) => {
    set(state => ({
      chatMessages: [
        ...state.chatMessages,
        { isMe: true, message },
      ],
    }));
  },
}));


export default useChatStore;