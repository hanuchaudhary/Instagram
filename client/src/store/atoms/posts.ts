import { atom } from "recoil";

export interface comment {
    id: number
    comment: string
    createdAt: string
    user: {
        username: string
        avatar: string
    }
}

export interface post {
    id: number
    caption: string
    location: string
    mediaURL: string
    createdAt: string
    isLiked: boolean
    _count: {
        likes: number
        comments: number
    }
    comments: comment[]
    User: {
        id: string
        username: string
        bio: string
        fullName: string
        avatar: string
    }
}

interface Posts {
    posts: post[]
}

export const postsState = atom<Posts>({
    key: "posts",
    default: {
        posts : [
            {
                id: 0,
                caption: "",
                location: "",
                mediaURL: "",
                createdAt: "",
                isLiked: false,
                _count: {
                    likes: 0,
                    comments: 0,
                },
                comments: [],
                User: {
                    id: "",
                    username: "",
                    fullName: "",
                    bio: "",
                    avatar: "",
                }
            }
        ]
    }
})