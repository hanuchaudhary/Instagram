export interface comment {
    id: number
    comment: string
    createdAt: string
    user: {
        id: string
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
    mediaType: string
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