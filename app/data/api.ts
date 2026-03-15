import { storage } from '../utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

// Interfaces

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
    _id: string;
    email: string;
    role: string;
    isProfileCompleted: boolean;
    profile: UserDetails;
    appliedJobsCount?: number;
}

export interface RecruiterProfile {
    companyName: string;
    companyWebsite: string;
    industry: string;
    companySize: string;
    location: string;
    accountabilityScore: number;
    verifiedCompany: boolean;
}

export interface Job {
    _id: string;
    title: string;
    companyName: string;
    description: string;
    location: string;
    jobType: string;
    salaryRange: {
        min: number;
        max: number;
        currency: string;
    };
    skillsRequired: string[];
    experienceLevel: string;
    applicantsCount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    recruiter: {
        _id: string;
        email: string;
        profile: UserDetails;
        recruiterProfile: RecruiterProfile;
    };
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface JobsResponse {
    success: boolean;
    count: number;
    pagination: {
        totalJobs: number;
        currentPage: number;
        totalPages: number;
    };
    jobs: Job[];
}

export interface Reel {
    _id: string;
    title: string;
    description: string;
    type: string;
    tags: string[];
    creatorId: string;
    videoUrl: string;
    thumbnailUrl: string;
    createdAt: string;
    updatedAt: string;
}

// Request Helper

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await storage.getToken();

    const isFormData = options.body instanceof FormData;

    const config = {
        ...options,
        headers: {
            ...(!isFormData && { 'Content-Type': 'application/json' }),
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

// API Objects

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
};

export const user = {
    completeProfile: (profileData: any) => {
        return request<{ success: boolean; user: User }>('/users/complete-profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },
    uploadAvatar: (formData: FormData) => {
        return request<{ success: boolean; imageUrl: string; user: User }>('/users/upload', {
            method: 'POST',
            body: formData,
        });
    },
    getMe: () => {
        return request<{ success: boolean; user: User }>('/users/me', {
            method: 'GET',
        });
    }
};

export const jobs = {
    getAll: () => {
        return request<JobsResponse>('/all-jobs', {
            method: 'GET',
        });
    }
};

export const reels = {
    create: (formData: FormData) => {
        return request<{ success: boolean; message: string; data: any }>('/reels', {
            method: 'POST',
            body: formData,
        });
    }
};