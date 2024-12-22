export enum AccountType {
    PRIVATE = "private",
    PUBLIC = "public"
}

export enum mediaType{
    image,
    video
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
    posts?: PostType[]; // Array of Post objects
    _count : {
        followers : number,
        following : number,
        posts : number
    }
    createdAt?: Date; // Date object
    updatedAt?: Date; // Date object
}

export interface FollowersType {
    id: string; // UUID string
    userId: string; // UUID string
    user?: UserType; // User object
}

export interface FollowingType {
    id: string; // UUID string
    userId: string; // UUID string
    user?: UserType; // User object
}

export interface PostType {
    id?: number; // Auto-incremented integer// String title
    caption: string; // String caption
    location?: string; // Optional string location
    mediaURL?: string; // Optional string for media URL
    user?: UserType; // User object reference
    userId?: string; // Optional string for user ID
    comments?: CommentType[]; // Array of Comment objects
    likes?: LikeType[]; // Array of Like objects
    createdAt: Date; // Date object
}

export interface CommentType {
    id: number; // Auto-incremented integer
    postId: number; // Integer reference to Post
    userId: string; // String reference to User
    post?: PostType; // Post object reference
    user?: UserType; // User object reference
    createdAt: Date; // Date object
}

export interface LikeType {
    id: number; // Auto-incremented integer
    isLiked: boolean; // Boolean value
    postId: number; // Integer reference to Post
    userId: string; // String reference to User
    post?: PostType; // Post object reference
    user?: UserType; // User object reference
    createdAt: Date; // Date object
}
