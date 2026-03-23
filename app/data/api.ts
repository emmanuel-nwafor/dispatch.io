import { storage } from '../utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

// Interfaces

export interface UserDetails {
    fullName: string;
    headline: string;
    phone: string;
    bio: string;
    location: string;
    resumeUrl: string;
    skills: string[];
    experience: any[];
    education: any[];
    languages: string[];
    birthday: string;
    gender: string;
    portfolioUrl: string;
    linkedInUrl: string;
    preferredJobTypes: string[];
    autoApply: {
        enabled: boolean;
        minMatchScore: number;
    };
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
    comments: {
        userId: any;
        text: string;
        createdAt: string;
    }[];
    createdAt: string;
}

export interface User {
    createdAt: number;
    _id: string;
    id?: string;
    email: string;
    username?: string;
    role: string;
    isProfileCompleted: boolean;
    avatar?: string;
    coverImage?: string;
    profile?: UserDetails;
    recruiterProfile?: RecruiterProfile;
    details?: UserDetails | RecruiterProfile;
    appliedJobsCount?: number;
    followers?: string[] | any[];
    following?: string[] | any[];
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
        avatar: string;
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
    comments: never[];
    _id: string;
    title: string;
    description: string;
    type: 'seeker_pitch' | 'company_tour' | 'job_preview';
    tags: string[];
    creatorId: any;
    videoUrl: string;
    playbackId?: string;
    thumbnailUrl: string;
    likes: string[];
    views: number;
    createdAt: string;
    updatedAt: string;
}

export interface FeedItemData {
    id: string | number;
    userId?: string;
    type: 'job' | 'post' | 'reel' | 'candidate';
    user: string;
    handle: string;
    avatar: string;
    time: string;
    content: string;
    isLiked?: boolean;
    isReshared?: boolean;
    jobRole?: string;
    salary?: string;
    location?: string;
    stats: {
        comments: string;
        reposts: string;
        likes: string;
    };
    attachments?: Array<{
        type: 'image' | 'video';
        url: string;
        thumbnail?: string;
    }>;
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
        return request<{
            message: string; success: boolean; imageUrl: string; user: User
        }>('/users/upload', {
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
        return request<{
            message: string; success: boolean; user: User
        }>('/users/me', {
            method: 'GET',
        });
    },
    deleteAccount: () => {
        return request<{ success: boolean }>('/users/profile', {
            method: 'DELETE',
        });
    },
    follow: (id: string) => {
        return request<{ success: boolean; message: string }>(`/users/follow/${id}`, {
            method: 'POST',
        });
    },
    unfollow: (id: string) => {
        return request<{ success: boolean; message: string }>(`/users/unfollow/${id}`, {
            method: 'POST',
        });
    },
    getFollowers: (id: string) => {
        return request<{ success: boolean; followers: any[] }>(`/users/${id}/followers`, {
            method: 'GET',
        });
    },
    getFollowing: (id: string) => {
        return request<{ success: boolean; following: any[] }>(`/users/${id}/following`, {
            method: 'GET',
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
        return request<{
            message: string; success: boolean; data: Post
        }>('/posts', {
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
    },
    getByUser: (userId: string) => {
        return request<{ success: boolean; data: Post[] }>(`/posts?userId=${userId}`, {
            method: 'GET',
        });
    },
    like: (id: string) => {
        return request<{ success: boolean }>((`/posts/${id}/like`), {
            method: 'POST',
        });
    },
    comment: (id: string, text: string) => {
        return request<{ success: boolean; data: Post }>(`/posts/${id}/comment`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
    },
    reshare: (id: string, content?: string) => {
        return request<{ success: boolean; data: Post }>(`/posts/${id}/reshare`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });
    }
};

export const reels = {
    getUploadUrl: () => {
        return request<{ success: boolean; data: { uploadUrl: string; uploadId: string } }>('/reels/upload-url', {
            method: 'GET',
        });
    },
    create: (data: FormData | any) => {
        const isFormData = data instanceof FormData;
        return request<{ success: boolean; message: string; data: Reel }>('/reels', {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
        });
    },
    delete: (id: string) => {
        return request<{ success: boolean }>(`/reels/${id}`, {
            method: 'DELETE',
        });
    },
    getByUser: (userId: string) => {
        return request<{ success: boolean; data: Reel[] }>(`/reels?userId=${userId}`, {
            method: 'GET',
        });
    },
    like: (id: string) => {
        return request<{ success: boolean; data: Reel }>(`/reels/${id}/like`, {
            method: 'POST',
        });
    },
    comment: (id: string, text: string) => {
        return request<{ success: boolean; data: Reel }>(`/reels/${id}/comment`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
    }
};

export const feeds = {
    getFeed: (page = 1, limit = 10) => {
        return request<{ success: boolean; data: any[] }>(`/feed?page=${page}&limit=${limit}`, {
            method: 'GET',
        });
    },
    getFeedItem: (id: string, type?: string) => {
        return request<{ success: boolean; data: any }>(`/feed/${id}${type ? `?type=${type}` : ''}`, {
            method: 'GET',
        });
    },
    getReels: (page = 1, limit = 10) => {
        return request<{ success: boolean; data: any[] }>(`/feed/reels?page=${page}&limit=${limit}`, {
            method: 'GET',
        });
    }
};