import React from "react";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { auth } from "../../config/firebase";
import Logo from "../../assets/navigator.png";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      toast.success("Password reset email sent. Please check your inbox.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "text-sm",
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;

      if (firebaseError.code === "auth/user-not-found") {
        setEmailError("User not found. Please check your email.");
        toast.error("User not found. Please check your email.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          className: "text-sm",
        });
      } else if (firebaseError.code === "auth/invalid-email") {
        setEmailError("Invalid email format. Please enter a valid email.");
        toast.error("Invalid email format. Please enter a valid email.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          className: "text-sm",
        });
      } else {
        setEmailError("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          className: "text-sm",
        });
      }
      console.error(firebaseError);
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

        {!isEmailSent ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
              Reset Your Password
            </h2>
            <p className="text-sm text-center text-gray-400 mb-4">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 dark:text-gray-100"
              >
                Email Address
              </label>
              <input
                type="email"
                name=""
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.address"
                className="w-full px-3 py-2 dark:text-white border border-gray-200 dark:border-dark-bg-secondary dark:bg-dark-bg-secondary rounded focus:outline-none focus:border-cerulean-blue placeholder-gray-600"
                required
              />
              {emailError &&
                toast.error(emailError, {
                  position: "bottom-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  className: "text-sm",
                })}
            </div>

            <button
              type="submit"
              className="w-full bg-cerulean-blue text-white py-2 rounded hover:bg-light-blue transition-colors cursor-pointer"
            >
              Send Password Reset Link
            </button>

            <div className="text-center mt-4">
              <Link
                to="/auth/signin"
                className="text-sm text-cerulean-blue hover:no-underline"
              >
                Return to Sign In
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Check your Email
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We've sent a password reset link to <strong className="dark:text-gray-100">{email}</strong>.
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
            <button
              onClick={() => navigate("/auth/signin")}
              className="w-full bg-cerulean-blue text-white py-2 rounded hover:no-underline dark:hover:no-underline cursor-pointer mt-4"
            >
              Return to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
