import { atom } from "recoil";
import { SearchedUser } from "./users";


interface SuggestedUsers {
    users: SearchedUser[]
}

export const suggestedUsersAtom = atom<SuggestedUsers>({
    key: "suggestedUsers",
    default: {
        users:  [
            {
                id: "",
                username: "",
                fullName: "",
                avatar: "",
                isFollowing : false,
                bio: "",
                location: ""
            }
        ]
    }
});