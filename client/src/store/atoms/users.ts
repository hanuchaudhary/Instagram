import { atom } from "recoil";

export interface SearchedUser {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    isFollowing: boolean;
}

interface SearchedUsersSchema {
    users: SearchedUser[];
}

export const users = atom<SearchedUsersSchema>({
    key: "searchedUsers",
    default: {
        users: [
            {
                id: "",
                username: "",
                fullName: "",
                avatar: "",
                isFollowing: false
            }
        ] 
    }
});
