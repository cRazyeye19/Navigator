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

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/tasks/:id" element={<TaskPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
