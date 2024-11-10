import { atom } from "recoil"

interface FollowData {
    id: string,
    avatar: string,
    username: string
}


export const followDatasState = atom<FollowData[]>({
    key: "followersState",
    default :[]
});

