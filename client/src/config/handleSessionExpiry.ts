import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const useSessionExpiryHandler = () => {
    const navigate = useNavigate();

    return () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            if (decodedToken.exp < currentTime) {
                localStorage.removeItem("token");
                navigate("/auth/signin", { replace: true });
            }
        }
    };
};
