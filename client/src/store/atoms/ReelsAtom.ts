import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { atom, selector } from "recoil";

export interface Reel {
    id: string;
    mediaURL: string;
    caption: string;
    createdAt: string;
    User: {
        avatar: string;
        username: string;
    };
}

export const reelsSelector = selector<Reel[]>({
    key: "reelsSelector",
    get: async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/feature/reels`, {
                headers: {
                    Authorization: `${localStorage.getItem("token")?.split(" ")[1]}`,
                },
            });
            return data.reels as Reel[];
        } catch (error) {
            console.error("Error fetching reels:", error);
            return [];
        }
    },
});

// Atom to store the fetched reels
export const reelsState = atom<Reel[]>({
    key: "reelsState",
    default: [],
});
