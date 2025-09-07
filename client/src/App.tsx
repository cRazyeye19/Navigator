import MainPage from "./pages/Main/MainPage";
import TaskPage from "./pages/Tasks/TaskPage";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyOTP from "./pages/Auth/VerifyOTP";
import {
  AUTH_SIGN_IN_ROUTE,
  AUTH_SIGN_UP_ROUTE,
  AUTH_RESET_PASSWORD_ROUTE,
  AUTH_VERIFY_OTP_ROUTE,
  HOME_ROUTE,
  TASK_DETAIL_ROUTE_PREFIX,
} from "./constants/routes";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path={AUTH_SIGN_IN_ROUTE} element={<SignIn />} />
        <Route path={AUTH_SIGN_UP_ROUTE} element={<SignUp />} />
        <Route path={AUTH_RESET_PASSWORD_ROUTE} element={<ResetPassword />} />
        <Route path={AUTH_VERIFY_OTP_ROUTE} element={<VerifyOTP />} />
        <Route element={<ProtectedRoute />}>
          <Route path={HOME_ROUTE} element={<MainPage />} />
          <Route path={`${TASK_DETAIL_ROUTE_PREFIX}:id`} element={<TaskPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
