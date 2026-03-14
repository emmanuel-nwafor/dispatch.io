import { storage } from '../utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

// Generic API request helper to handle JSON and common headers.
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

// Auth apis
export const auth = {
    // OTP Generation
    sendOtp: (email: string) => {
        return request<{ success: boolean; message: string }>('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    // OTP Verification & Registration/Login
    verifyOtp: (email: string, otp: string) => {
        return request<{ success: boolean; token: string; user: any; isNewUser: boolean }>('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });
    },

    // Get current user profile
    getMe: () => {
        return request<{ success: boolean; user: any }>('/auth/me', {
            method: 'GET',
        });
    }
};

export const profile = {
    complete: (userData: any) => {
        return request<{ success: boolean; message: string; user: any }>('/user/complete-profile', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }
};

export const jobs = {
    getAll: () => {
        return request<{ success: boolean; jobs: any[] }>('/jobs', {
            method: 'GET',
        });
    },
    create: (jobData: any) => {
        return request<{ success: boolean; job: any }>('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData),
        });
    }
};

export const applications = {
    apply: (jobId: string) => {
        return request<{ success: boolean; message: string }>('/applications/apply', {
            method: 'POST',
            body: JSON.stringify({ jobId }),
        });
    },
    analyze: (jobId: string) => {
        return request<{ success: boolean; score: number; analysis: string; suggestions: string[] }>('/applications/analyze', {
            method: 'POST',
            body: JSON.stringify({ jobId }),
        });
    },
    getMy: () => {
        return request<{ success: boolean; applications: any[] }>('/applications/my', {
            method: 'GET',
        });
    }
};