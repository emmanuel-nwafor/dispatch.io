import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const storage = {
    saveToken: async (token: string) => {
        try {
            if (Platform.OS === 'web') {
                localStorage.setItem(TOKEN_KEY, token);
            } else {
                await SecureStore.setItemAsync(TOKEN_KEY, token);
            }
        } catch (error) {
            console.error('Error saving token:', error);
        }
    },

    getToken: async () => {
        try {
            let token;
            if (Platform.OS === 'web') {
                token = localStorage.getItem(TOKEN_KEY);
            } else {
                token = await SecureStore.getItemAsync(TOKEN_KEY);
            }
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    saveUser: async (user: any) => {
        try {
            const userStr = JSON.stringify(user);
            if (Platform.OS === 'web') {
                localStorage.setItem(USER_KEY, userStr);
            } else {
                await SecureStore.setItemAsync(USER_KEY, userStr);
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    },

    getUser: async () => {
        try {
            let userStr;
            if (Platform.OS === 'web') {
                userStr = localStorage.getItem(USER_KEY);
            } else {
                userStr = await SecureStore.getItemAsync(USER_KEY);
            }
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    clearAll: async () => {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            } else {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
                await SecureStore.deleteItemAsync(USER_KEY);
            }
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
};