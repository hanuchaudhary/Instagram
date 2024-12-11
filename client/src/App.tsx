import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import VerifyAccount from "./pages/auth/Verify";
import AppLayout from "./pages/AppLayout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import MessagesPage from "./pages/MessagePage";
import CreatePostPage from "./pages/CreatePostPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import { useRecoilValue } from "recoil";
import { authTokenState } from "./store/atoms/AuthenticatedToken";
import UserProfilePage from "./pages/UserProfilePage";
import ReelsPage from "./pages/ReelsPage";

const App = () => {
  const token = useRecoilValue(authTokenState);
  const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
    if (!token) {
      return <Navigate to="/auth/signin" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/verify/:username" element={<VerifyAccount />} />
        <Route
          element={
            <AuthMiddleware>
              <AppLayout />
            </AuthMiddleware>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="create" element={<CreatePostPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="reels" element={<ReelsPage />} />
          <Route path="user/:username" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
