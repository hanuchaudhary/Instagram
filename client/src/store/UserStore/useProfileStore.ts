import api from '@/config/axios';
import { create } from 'zustand';


export enum AccountType {
    PRIVATE = "private",
    PUBLIC = "public"
}

export interface UserType {
    loading?: boolean;
    id?: string;
    username: string;
    fullName: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
    accountType: AccountType;
    posts?: PostType[];
    following?: FollowersType[];
    followers?: FollowersType[];
    _count: {
        followers: number;
        following: number;
        posts: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FollowersType {
    id: string;
    user: {
        avatar: string,
        username: string
    }
}

export interface PostType {
    id?: number;
    caption: string;
    location?: string;
    mediaURL?: string;
    mediaType?: string;
    User?: UserType;
    userId?: string;
    createdAt: Date;
    _count?: {
        likes: number;
        comments: number;
    };
}

interface ProfileStore {
    profile: UserType;
    fetchProfile: () => void;
    deleteProfilePost: (postId: number) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: {} as UserType,
    fetchProfile: async () => {
        try {
            const res = await api.get(`/user/me`);
            set({ profile: res.data.user });
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    },
    deleteProfilePost: async (postId: number) => {
        try {
            await api.delete(`/post/delete/${postId}`);
            set((state) => {
                const newProfile = { ...state.profile };
                newProfile.posts = newProfile.posts?.filter((post) => post.id !== postId);
                return { profile: newProfile };
            });
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }
}));

export const useLoggedUserId = () => {
    const LocalId = localStorage.getItem('user');
    const userId = useProfileStore((state) => state.profile.id) || JSON.parse(LocalId || '{}').id;
    return userId;
}