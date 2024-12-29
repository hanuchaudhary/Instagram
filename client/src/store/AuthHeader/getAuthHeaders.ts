import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    token: string | null;
    user: {
        id: string;
        username: string;
        avatar: string;
    } | null;
    setAuth: (token: string, user: { id: string; username: string; avatar: string }) => void;
    clearAuth: () => void;
}

export const useAuthStore = create(
    persist<AuthState>(
        (set) => ({
            token: localStorage.getItem("token"),
            user: localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")!)
                : null,
            setAuth: (token, user) => {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                set({ token, user });
            },
            clearAuth: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                set({ token: null, user: null });
            },
        }),
        {
            name: "auth-store",
        }
    )
);

interface UserState {
    stateUser: { id: string; username: string; avatar: string } | null;
    setUser: (user: { id: string; username: string; avatar: string }) => void;
    clearUser: () => void;
}

export const useUserStore = create(
    persist<UserState>(
        (set) => ({
            stateUser: localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")!)
                : null,
            setUser: (user) => {
                localStorage.setItem("user", JSON.stringify(user));
                set({ stateUser: user });
            },
            clearUser: () => {
                localStorage.removeItem("user");
                set({ stateUser: null });
            },
        }),
        {
            name: "user-store",
        }
    )
);
