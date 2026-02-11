import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    role: 'seeker' | 'employer' | null;
    setRole: (role: 'seeker' | 'employer') => void;
    clearRole: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            role: null,
            setRole: (role) => set({ role }),
            clearRole: () => set({ role: null }),
        }),
        {
            name: 'user-role-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);