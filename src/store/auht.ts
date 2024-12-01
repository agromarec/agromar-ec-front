import { AgroMarApi } from "@/api/AgroMarApi";
import { Roles } from "@/config/globalVariables";
import { to } from "@/helpers";
import { IUserResponse } from "@/interfaces/users";
import { toast } from "sonner";
import { create } from "zustand";

interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: IUserResponse | null;
  token: string;
  error: string;

  isOpenModal: boolean;
  isSigningUp: boolean;

  login: (user: any, onSuccess: () => void) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;
  onToggleSignup: (isSigningUp: boolean) => void;
  signup: (user: any, onSuccess: () => void) => Promise<void>;

  onClose: () => void;
  onOpen: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  status: 'loading',
  user: null,
  token: '',
  error: '',
  isSigningUp: false,

  isOpenModal: false,

  onToggleSignup: (isSigningUp: boolean) => {
    set({ isSigningUp });
  },

  onClose: () => {
    set({ isOpenModal: false, isSigningUp: false });
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

  signup: async (data: any, onSuccess?: () => void) => {
    set({ status: 'loading' });

    const newUser = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      paypalEmail: data.paypalEmail,
      paisId: Number(data.paisId),
      cantonId: Number(data.cantonId) || null,
      password: data.password,
      roles: [
        Roles.COMPRADOR,
        Roles.VENDEDOR,
      ]
    };

    const [response, error] = await to(AgroMarApi.post('/auth/signup', newUser));


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
