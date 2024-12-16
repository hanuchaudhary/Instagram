import { atom } from "recoil";

interface ExplorePost {
    id: string;
    mediaURL: string;
    mediaType: string;
    _count: {
        likes: number;
    }
}

export const explorePostsState = atom<ExplorePost[]>({
    key: "explorePostsState",
    default: []
})
