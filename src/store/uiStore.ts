import { create } from "zustand";

interface UiState {
  dialogOptions: {
    title: string;
    description: string;
    open: boolean;
    isLoading: boolean;
    btnAcceptText: string;
    btnCancelText: string;
    onClose?: () => void;
    onAccept?: () => void;
  }

  onCloseDialog: () => void;
  onOpenDialog: () => void;

  setDialogOptions: (options: UiState['dialogOptions'] | ((prevState: UiState['dialogOptions']) => UiState['dialogOptions'])) => void;
}

const useUiStore = create<UiState>()((set) => ({
  dialogOptions: {
    title: '',
    description: '',
    open: false,
    isLoading: false,
    btnAcceptText: 'Aceptar',
    btnCancelText: 'Cancelar',
    onClose: () => { },
    onAccept: () => { },
  },

  setDialogOptions: (options: UiState['dialogOptions'] | ((prevState: UiState['dialogOptions']) => UiState['dialogOptions'])) => {
    set(state => ({ dialogOptions: typeof options === 'function' ? options(state.dialogOptions) : options }));
  },

  onCloseDialog: () => {
    set(state => ({ dialogOptions: { ...state.dialogOptions, open: false } }));
  },

  onOpenDialog: () => {
    set(state => ({ dialogOptions: { ...state.dialogOptions, open: true } }));
  },
}));

export default useUiStore;