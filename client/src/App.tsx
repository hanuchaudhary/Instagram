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

const App = () => {
  const token = localStorage.getItem("token");
  // const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  //   if (!token) {
  //     return <Navigate to="/auth/signin" />;
  //   }
  //   return <>{children}</>;
  // };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/verify/:username" element={<VerifyAccount />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="create" element={<CreatePostPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
