import React, { useState } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import Logo from "../../assets/navigator.png";

const VerifyOTP = () => {
  //   const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [actionCode, setActionCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the action code from the URL
  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("oobCode");
    if (code && !isVerified) {
      setActionCode(code);
      verifyCode(code);
    }
  }, [location.search, isVerified]);

  const verifyCode = async (code: string) => {
    try {
      if(isVerified) return;
      // Verify the password reset code is valid
      const email = await verifyPasswordResetCode(auth, code);
      setIsVerified(true);
      toast.success(`Verification successful for ${email}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "text-sm",
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setError("Invalid or expired code. Please try again.");
      toast.error("Invalid or expired code. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "text-sm",
      });
      console.error("Error verifying code:", firebaseError);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      // Complete the password reset
      await confirmPasswordReset(auth, actionCode, newPassword);
      toast.success("Password reset successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "text-sm",
      });
      navigate("/auth/signin");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setError("Failed to reset password. Please try again.");
      toast.error("Failed to reset password. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "text-sm",
      });
      console.error("Error resetting password:", firebaseError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ghost-white dark:bg-dark-bg-primary">
      <div className="w-full max-w-[400px] mx-4">
        <Link
          to="/"
          className="flex items-center justify-center align-middle mb-8"
        >
          <img src={Logo} alt="Navigator Logo" className="w-12 h-12" />
          <p className="mx-2 mt-1 text-4xl font-bold text-cerulean-blue">
            Navigator
          </p>
        </Link>

        {!actionCode ? (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Invalid Link
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              The password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link
              to="/auth/reset-password"
              className="block w-full bg-cerulean-blue text-white py-2 rounded hover:bg-light-blue transition-colors cursor-pointer mt-4 text-center"
            >
              Request New Link
            </Link>
          </div>
        ) : !isVerified ? (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Verifying...
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Please wait while we verify your reset code.
            </p>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
              Create New Password
            </h2>

            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm text-gray-600 dark:text-gray-100"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-dark-bg-secondary dark:bg-dark-bg-secondary dark:text-white rounded focus:outline-none focus:border-cerulean-blue placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500 dark:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="bx bx-show-alt"></i>
                  ) : (
                    <i className="bx bx-hide"></i>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-gray-600 dark:text-gray-100"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-dark-bg-secondary dark:bg-dark-bg-secondary dark:text-white rounded focus:outline-none focus:border-cerulean-blue placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500 dark:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <i className="bx bx-show-alt"></i>
                  ) : (
                    <i className="bx bx-hide"></i>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-cerulean-blue text-white py-2 rounded hover:bg-light-blue transition-colors cursor-pointer"
            >
              Reset Password
            </button>

            <div className="text-center mt-4">
              <Link
                to="/auth/signin"
                className="text-sm text-cerulean-blue hover:no-underline"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;
