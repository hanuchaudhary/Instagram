import api from '@/config/axios';
import { toast } from 'sonner';
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
    isVerifiedAccount: boolean;
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
    isFetchingProfile: boolean;
    fetchProfile: () => void;

    deleteProfilePost: (postId: number) => void;

    isUpdatingProfile: boolean;
    updateProfile: (profileData: any) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    isFetchingProfile: true,
    profile: {} as UserType,
    fetchProfile: async () => {
        try {
            const res = await api.get(`/user/me`);
            set({ profile: res.data.user });
        } catch (error) {
            console.error("Error fetching profile:", error);
        }finally{
            set({ isFetchingProfile: false });
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
    },

    isUpdatingProfile: false,
    updateProfile: async (profileData) => {
        try {
            set({ isUpdatingProfile: true });
            const res = await api.post(`/user/edit`, profileData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const data = res.data
            toast.success(res.data.message || "Profile updated successfully");
            set((state) => ({ profile: { ...state.profile, bio: data.updatedUser.bio, avatar: data.updatedUser.avatar, fullName: data.updatedUser.fullName } }));
        } catch (error: any) {
            toast.error(error.response.data.message || "Error updating profile");
            console.error("Error updating profile:", error);
        }finally {
            set({ isUpdatingProfile: false });
        }
    }
}));

