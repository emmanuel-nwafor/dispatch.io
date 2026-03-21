import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    role: 'seeker' | 'employer' | null;
    user: any | null;
    setRole: (role: 'seeker' | 'employer') => void;
    setUser: (user: any) => void;
    clearRole: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            role: null,
            user: null,
            setRole: (role) => set({ role }),
            setUser: (user) => set({ user }),
            clearRole: () => set({ role: null, user: null }),
        }),
        {
            name: 'user-role-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);