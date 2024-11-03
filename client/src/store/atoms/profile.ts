import { atom, selector } from 'recoil';

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
    following?: FollowingType[];
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
    userId: string;
    user?: UserType;
}

export interface FollowingType {
    id: string;
    userId: string;
    user?: UserType;
}

export interface PostType {
    id?: number;
    caption: string;
    location?: string;
    mediaURL?: string;
    user?: UserType;
    userId?: string;
    createdAt: Date;
    _count?: {
        likes: number;
        comments: number;
    };
}

// Recoil atom for the current user's profile
export const currentProfileState = atom<UserType>({
    key: "currentProfileState",
    default: {
        loading: true,
        id: "",
        accountType: AccountType.PUBLIC,
        email: "",
        fullName: "",
        password: "",
        bio: "",
        avatar: "",
        username: "",
        _count: {
            followers: 0,
            following: 0,
            posts: 0,
        },
        posts: [], // Initialize as an empty array
    },
});

export const currentProfileSelector = selector({
    key: "currentProfileSelector",
    get: ({ get }) => get(currentProfileState),
});
