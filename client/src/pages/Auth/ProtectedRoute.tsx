import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import { LOADING_MESSAGE } from "../../constants/auth";
import { AUTH_SIGN_IN_ROUTE } from "../../constants/routes";

const ProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>{LOADING_MESSAGE}</div>;
  }

  if (!user) {
    return <Navigate to={AUTH_SIGN_IN_ROUTE} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
