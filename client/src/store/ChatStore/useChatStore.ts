import api from "@/config/axios";
import { MessageType, UserType } from "@/types/TypeInterfaces";
import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { useAuthStore } from "../AuthStore/useAuthStore";

interface messageData {
    message: string;
    image?: string;
}

const socketURI = "http://localhost:8080";

interface ChatStore {
    selectedUser: UserType | null;
    setSelectedUser: (selectedUser: UserType | null) => void;

    chatUsers: UserType[];
    isChatUsersLoading: boolean;
    fetchChatUsers: () => void;

    messages: MessageType[];
    isMessagesLoading: boolean;
    fetchMessages: () => void;

    sendMessage: (messageData: messageData) => void;
    subscribeToMessages: () => void;
    unSubscribeFromMessages: () => void;

    onlineUsers: string[];
    socket: Socket | null;
    socketConnect: () => void;
    socketDisconnect: () => void;

    isUserTyping: boolean;
    startTyping: () => void;
    stopTyping: () => void;

    sharePost: (messageData: messageData, selectedUserIds: string) => void;
    isSharingPost: boolean;


}

export const useChatStore = create<ChatStore>((set, get) => ({
    selectedUser: null,
    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },

    chatUsers: [],
    isChatUsersLoading: true,
    fetchChatUsers: async () => {
        try {

            const response = await api.get("/feature/chat-users");
            set({ chatUsers: response.data.chatUsers });
        } catch (error) {
            console.log(error);

        } finally {
            set({ isChatUsersLoading: false });
        }
    },

    isMessagesLoading: true,
    messages: [],
    fetchMessages: async () => {
        const toUserId = get().selectedUser?.id;
        try {
            const response = await api.get(`/feature/messages/${toUserId}`);
            set({ messages: response.data.messages });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const loggedUserId = useAuthStore.getState().authUser?.id;
        const { selectedUser, messages } = get();
        try {
            const response = await api.post(`${socketURI}/message/${loggedUserId}/${selectedUser?.id}`, messageData);
            console.log("Message sent");
            set({ messages: [...messages, response.data.newMessage] });
        } catch (error) {
            console.log(error);
        }
    },

    isSharingPost: false,
    sharePost: async (messageData, selectedUserIds) => {
        const loggedUserId = useAuthStore.getState().authUser?.id;
        const { messages } = get();
        set({ isSharingPost: true });
        try {
            const response = await api.post(`${socketURI}/send-post/${loggedUserId}/${selectedUserIds}`, messageData);
            set({ messages: [...messages, response.data.newMessage] });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isSharingPost: false })
        }
    },
    subscribeToMessages: () => {
        const socket = get().socket;
        socket?.on("newMessage", (message: MessageType) => {
            if (message.senderId !== get().selectedUser?.id) return;
            set((state) => ({
                messages: [...state.messages, message],
            }));
        });
    },
    unSubscribeFromMessages: () => {
        const socket = get().socket;
        socket?.off("newMessage");
    },

    isUserTyping: false,
    startTyping: () => {
        const socket = get().socket;
        const toUserId = get().selectedUser?.id;
        socket?.emit("startTyping", toUserId);
        set({ isUserTyping: true });
    },
    stopTyping: () => {
        const socket = get().socket;
        const toUserId = get().selectedUser?.id;
        socket?.emit("stopTyping", toUserId);
        set({ isUserTyping: false });
    },

    onlineUsers: [],
    socket: null,
    socketConnect: () => {
        console.log("Connecting to socket...");
        const authUser = useAuthStore.getState().authUser;
        if (!authUser || get().socket?.connected) return;
        const socket = io(socketURI, {
            query: {
                userId: authUser.id
            }
        })
        set({ socket })
        socket.connect()

        socket.on("getOnlineUsers", (users) => {
            set({ onlineUsers: users });
        });
    },
    socketDisconnect: () => {
        console.log("Disconnecting from socket...");
        get().socket?.disconnect();
    },

}));
