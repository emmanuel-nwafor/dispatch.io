
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

// Generic API request helper to handle JSON and common headers.
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

    requestOtp: (email: string) => {
        return request('/api/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    verifyOtp: (email: string, otp: string) => {
        return request('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });
    },
};

// complete profile
export const completeProfile = (userData: any) => {
    return request('/auth/complete-profile', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};