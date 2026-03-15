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

export interface RecruiterProfile {
    companyName: string;
    companyWebsite: string;
    industry: string;
    companySize: string;
    location: string;
    accountabilityScore: number;
    verifiedCompany: boolean;
}

export interface Post {
    _id: string;
    creatorId: any;
    content: string;
    images: string[];
    likes: string[];
    createdAt: string;
}

export interface User {
    createdAt: number;
    _id: string;
    email: string;
    role: string;
    isProfileCompleted: boolean;
    avatar?: string;
    coverImage?: string;
    profile: UserDetails;
    recruiterProfile?: RecruiterProfile;
    appliedJobsCount?: number;
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
    updateProfile: (profileData: any) => {
        return request<{ success: boolean; user: User }>('/users/profile', {
            method: 'PATCH',
            body: JSON.stringify(profileData),
        });
    },
    uploadImage: (formData: FormData) => {
        return request<{ success: boolean; imageUrl: string; user: User }>('/users/upload', {
            method: 'POST',
            body: formData,
        });
    },
    getProfile: (id: string) => {
        return request<{ success: boolean; user: User }>(`/users/${id}`, {
            method: 'GET',
        });
    },
    getMe: () => {
        return request<{ success: boolean; user: User }>('/users/me', {
            method: 'GET',
        });
    },
    deleteAccount: () => {
        return request<{ success: boolean }>('/users/profile', {
            method: 'DELETE',
        });
    }
};

export const jobs = {
    getAll: (params?: any) => {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return request<JobsResponse>(`/all-jobs${query}`, {
            method: 'GET',
        });
    },
    getById: (id: string) => {
        return request<{ success: boolean; job: Job }>(`/jobs/${id}`, {
            method: 'GET',
        });
    },
    create: (jobData: any) => {
        return request<{ success: boolean; job: Job }>('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData),
        });
    },
    update: (id: string, jobData: any) => {
        return request<{ success: boolean; job: Job }>(`/jobs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(jobData),
        });
    },
    delete: (id: string) => {
        return request<{ success: boolean }>(`/jobs/${id}`, {
            method: 'DELETE',
        });
    }
};

export const posts = {
    create: (formData: FormData) => {
        return request<{ success: boolean; data: Post }>('/posts', {
            method: 'POST',
            body: formData,
        });
    },
    getAll: () => {
        return request<{ success: boolean; data: Post[] }>('/posts', {
            method: 'GET',
        });
    },
    delete: (id: string) => {
        return request<{ success: boolean }>(`/posts/${id}`, {
            method: 'DELETE',
        });
    }
};

export const reels = {
    create: (formData: FormData) => {
        return request<{ success: boolean; message: string; data: Reel }>('/reels', {
            method: 'POST',
            body: formData,
        });
    },
    delete: (id: string) => {
        return request<{ success: boolean }>(`/reels/${id}`, {
            method: 'DELETE',
        });
    }
};

export const feeds = {
    getFeed: (page = 1, limit = 10) => {
        return request<{ success: boolean; data: any[] }>(`/feed?page=${page}&limit=${limit}`, {
            method: 'GET',
        });
    }
};