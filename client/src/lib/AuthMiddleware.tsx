import { Navigate, Route } from "react-router-dom";

const AuthMiddleware = ({ children }: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/signin"} replace />;
  }
  return <Route>{children}</Route>;
};

export default AuthMiddleware;
