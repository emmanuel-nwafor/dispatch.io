// /app/data/api.ts
// This file centralizes all API calls for the application.

const BASE_URL = 'http://localhost:5000/api';

/**
 * Generic API request helper to handle JSON and common headers.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data as T;
    } catch (error) {
        console.error(`API Request Error [${endpoint}]:`, error);
        throw error;
    }
}

/**
 * Authentication related API calls.
 */
export const auth = {
    register: (userData: any) => {
        return request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    login: (credentials: any) => {
        return request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },
};

/**
 * Export other API modules here as they are created.
 * Example:
 * export const jobs = { ... };
 */