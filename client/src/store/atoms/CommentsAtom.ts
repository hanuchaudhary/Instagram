import { atom } from "recoil";

export interface CommentAtomInterface {
    id: number;
    postId: number;
    createdAt: string;
    comment: string;
    user: {
        username: string;
        avatar: string;
    };
}

const commentsAtom = atom<CommentAtomInterface[]>({
    key: "commentsAtom",
    default: [
        {
            id: 0,
            postId: 0,
            createdAt: "",
            comment: "",
            user: {
                username: "",
                    avatar: "",
                },
            }
        ]
    }
);

export default commentsAtom;

