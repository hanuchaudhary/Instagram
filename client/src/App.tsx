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
import UserProfilePage from "./pages/UserProfilePage";
import ReelsPage from "./pages/ReelsPage";
import Dashboard from "./admin/pages/Dashboard";
import SystemLogs from "./admin/pages/Logs";
import ContentModeration from "./admin/pages/Moderation";
import UserManagement from "./admin/pages/Users";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/auth/signin" replace />;
    }
    return <>{children}</>;
  };

  const AdminMiddleware = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/auth/signin" replace />;
    }
    const decodedToken: any = jwtDecode(token);
    if (decodedToken.role !== "admin") {
      return <Navigate to="/" replace />;
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
          path="/admin"
          element={
            <AdminMiddleware>
              <Dashboard />
            </AdminMiddleware>
          }
        />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/moderation" element={<ContentModeration />} />
        <Route path="/admin/logs" element={<SystemLogs />} />
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
