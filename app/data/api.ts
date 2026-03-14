import { storage } from '../utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

export interface UserDetails {
    autoApply: {
        enabled: boolean;
        minMatchScore: number;
    };
    fullName: string;
    phone: string;
    bio: string;
    location: string;
    resumeUrl: string;
    skills: string[];
    experienceYear: number;
    education: string;
    preferredJobTypes: string[];
}

export interface User {
    id: string;
    email: string;
    role: string;
    isProfileCompleted: boolean;
    details: UserDetails;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await storage.getToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
    };

    try {
        const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
        const response = await fetch(url, config);
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
            throw new Error(data?.message || `Error: ${response.status}`);
        }

        return data as T;
    } catch (error) {
        console.error(`API Request Error [${endpoint}]:`, error);
        throw error;
    }
}

export const auth = {
    sendOtp: (email: string) => {
        return request<{ success: boolean; message: string }>('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },
    login: (email: string, password: string) => {
        return request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },
    getMe: () => {
        return request<{ success: boolean; user: User }>('/auth/me', {
            method: 'GET',
        });
    }
};

