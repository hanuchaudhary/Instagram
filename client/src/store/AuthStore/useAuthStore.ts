import api from "@/config/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

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


interface AuthStoreProps {
    authUser: { id: string; username: string; avatar: string; email: string; role: string } | null;
    isSigningUp: boolean;
    signup: (values: any, navigate: any) => void;

    isVerifying: boolean;
    verify: (values: any, navigate: any, username: string) => void;

    isSigningIn: boolean;
    signin: (values: any, navigate: any) => void;
    checkAuth: () => void;
    logout: () => void;
}

const handleApiError = (error: any, defaultMessage: string) => {
    return error.response?.data?.message || defaultMessage;
};

export const useAuthStore = create<AuthStoreProps>((set) => ({
    isSigningUp: false,
    isVerifying: false,
    isSigningIn: false,
    authUser: null,

    signup: async (values, navigate) => {
        set({ isSigningUp: true });
        try {
            const response = await api.post(`/user/signup`, values);
            toast.success(`Welcome, ${response.data.username}! Your account has been successfully created.`);
            navigate(`/auth/verify/${response.data.username}`);
        } catch (error) {
            toast.error(handleApiError(error, "An error occurred during signup."));
        } finally {
            set({ isSigningUp: false });
        }
    },

    verify: async (values, navigate, username) => {
        set({ isVerifying: true });
        try {
            const response = await api.post(`/user/verify`, { ...values, username });
            navigate("/auth/signin", { replace: true });
            toast.success(response.data.message || "Account verified successfully.");
        } catch (error) {
            toast.error(handleApiError(error, "An error occurred during verification."));
        } finally {
            set({ isVerifying: false });
        }
    },

    signin: async (values, navigate) => {
        set({ isSigningIn: true });
        try {
            const response = await api.post(`/user/signin`, values);
            toast.success(`Welcome back, ${response.data.user.username}!`);
            localStorage.setItem("token", `Bearer ${response.data.token}`);
            navigate("/", { replace: true });
            set({ authUser: response.data.user });
        } catch (error) {
            toast.error(handleApiError(error, "An error occurred during signin."));
        } finally {
            set({ isSigningIn: false });
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token.split(" ")[1]);
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem("token");
                    set({ authUser: null });
                    toast.error("Session expired. Please sign in again.");
                    return;
                }
                const response = await api.get(`/user/auth/check`);
                set({ authUser: response.data.user });
            } catch (error) {
                localStorage.removeItem("token");
                set({ authUser: null });
                toast.error(handleApiError(error, "Authentication check failed."));
            }
        } else {
            set({ authUser: null });
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ authUser: null });
        toast.success("Successfully logged out.");
    },

    
}));
