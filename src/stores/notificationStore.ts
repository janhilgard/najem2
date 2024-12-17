import { create } from 'zustand';

interface NotificationState {
  message: string | null;
  showNotification: (message: string) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  
  showNotification: (message) => {
    set({ message });
    setTimeout(() => {
      set({ message: null });
    }, 3000);
  },
  
  hideNotification: () => set({ message: null })
}));