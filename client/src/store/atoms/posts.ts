import { atom } from "recoil";

export interface post {
    id: number
    caption: string
    location: string
    mediaURL: string
    createdAt: string
    User: {
        id: string
        username: string
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
                User: {
                    id: "",
                    username: "",
                    fullName: "",
                    avatar: "",
                }
            }
        ]
    }
})