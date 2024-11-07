import { AgroMarApi } from "@/api/AgroMarApi";
import { to } from "@/helpers";
import { toast } from "sonner";
import { create } from "zustand";

interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: any;
  token: string;
  error: string;

  isOpenModal: boolean;

  login: (user: any, onSuccess: () => void) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;

  onClose: () => void;
  onOpen: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  status: 'loading',
  user: null,
  token: '',
  error: '',

  isOpenModal: false,

  onClose: () => {
    set({ isOpenModal: false });
  },

  onOpen: () => {
    set({ isOpenModal: true });
  },

  checkAuth: async () => {
    set({ status: 'loading' });

    const [response, error] = await to(AgroMarApi.get('/auth/check'));

    if (error) {
      localStorage.clear();
      set({ status: 'unauthenticated', error: error.message });
      return;
    }

    const { token, ...user } = response.data;

    localStorage.setItem('token', token);

    set({
      status: 'authenticated',
      user,
      token,
      error: '',
    });
  },

  login: async (values: { email: string, password: string }, onSuccess?: () => void) => {
    set({ status: 'loading' });

    const [response, error] = await to(AgroMarApi.post('/auth/login', values));

    if (error) {
      set({ status: 'unauthenticated', error: error.message, isOpenModal: false });
      toast.error(error.message);
      return;
    }

    if (onSuccess) onSuccess();

    const { token, ...user } = response.data;

    localStorage.setItem('token', token);

    set({
      status: 'authenticated',
      user: user,
      token,
      error: '',
      isOpenModal: false,
    });
  },

  logout: () => {
    localStorage.clear();
    set({
      status: 'unauthenticated',
      user: null,
      token: '',
      error: '',
    });
  },
}));

export default useAuthStore;
