import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const storage = {
    // Generic Save
    saveItem: async (key: string, value: string) => {
        try {
            console.log(`[Storage] Saving: ${key}`);
            if (Platform.OS === 'web') {
                localStorage.setItem(key, value);
            } else {
                await SecureStore.setItemAsync(key, value);
            }
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    },

    // Generic Get
    getItem: async (key: string) => {
        try {
            let value;
            if (Platform.OS === 'web') {
                value = localStorage.getItem(key);
            } else {
                value = await SecureStore.getItemAsync(key);
            }
            console.log(`[Storage] Retrying ${key}:`, value ? 'Found' : 'Null');
            return value;
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return null;
        }
    },

    // Generic Remove
    removeItem: async (key: string) => {
        try {
            console.log(`[Storage] Removing: ${key}`);
            if (Platform.OS === 'web') {
                localStorage.removeItem(key);
            } else {
                await SecureStore.deleteItemAsync(key);
            }
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
        }
    },

    // --- Specialized Methods ---

    saveToken: async (token: string) => {
        await storage.saveItem(TOKEN_KEY, token);
    },

    getToken: async () => {
        return await storage.getItem(TOKEN_KEY);
    },

    saveUser: async (user: any) => {
        const userStr = JSON.stringify(user);
        await storage.saveItem(USER_KEY, userStr);
    },

    getUser: async () => {
        const userStr = await storage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    clearAll: async () => {
        try {
            console.log('[Storage] Clearing all session data...');
            if (Platform.OS === 'web') {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                // Also clear drafts/roles if needed
                localStorage.removeItem('profile_draft');
                localStorage.removeItem('user_role');
            } else {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
                await SecureStore.deleteItemAsync(USER_KEY);
                await SecureStore.deleteItemAsync('profile_draft');
                await SecureStore.deleteItemAsync('user_role');
            }
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
};