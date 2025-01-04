import api from "@/config/axios";
import { toast } from "sonner";
import { create } from "zustand";

interface sendPostStore {
    isSendingPost: boolean;
    sendPost: (userIds: string, message: string) => void;
}

export const useSendPostStore = create<sendPostStore>((set) => ({
    isSendingPost: false,
    sendPost: async (userIds, message) => {
        try {
            const response = await api.post(`/feature/send-post/${userIds}`, { message });
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        } finally {
            set({ isSendingPost: false });
        }
    }
}));