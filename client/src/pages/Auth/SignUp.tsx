import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import Logo from "../../assets/navigator.png";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        className: "text-sm",
      });
      navigate("/");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else {
        setError("Error creating account");
      }
      toast.error(firebaseError.message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        className: "text-sm",
      });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Sign up successful", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        className: "text-sm",
      });
      navigate("/");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      toast.error("An error occurred. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        className: "text-sm",
      });
      console.error("Error signing up with Google", firebaseError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ghost-white dark:bg-dark-bg-primary">
      <div className="w-full max-w-[400px] mx-4">
        <Link to="/" className="flex items-center justify-center mb-8">
          <img src={Logo} alt="Navigator Logo" className="w-12 h-12" />
          <p className="mx-3 mt-1 text-4xl font-bold text-cerulean-blue">
            Navigator
          </p>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-gray-600 dark:text-gray-100">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.address"
              className="w-full px-3 py-2 border border-gray-200 dark:border-dark-bg-secondary dark:bg-dark-bg-secondary dark:text-white rounded focus:outline-none focus:border-cerulean-blue placeholder-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-gray-600 dark:text-gray-100">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your secret password"
                className="w-full px-3 py-2 border border-gray-200 dark:border-dark-bg-secondary dark:bg-dark-bg-secondary dark:text-white rounded focus:outline-none focus:border-cerulean-blue placeholder-gray-600"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500 dark:text-gray-100"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border border-gray-200 dark:border-dark-bg-secondary dark:bg-dark-bg-secondary dark:text-white rounded focus:outline-none focus:border-cerulean-blue placeholder-gray-600"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500 dark:text-gray-100"
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-cerulean-blue text-white py-2 rounded hover:bg-light-blue transition-colors cursor-pointer"
          >
            Sign Up
          </button>

          <div className="relative flex items-center justify-center">
            <hr className="w-full border-gray-200 dark:border-dark-bg-tertiary" />
            <span className="absolute bg-ghost-white dark:bg-dark-bg-primary px-4 text-sm text-gray-500 dark:text-gray-100">
              or
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2 rounded hover:bg-gray-50 dark:hover:bg-dark-bg-secondary dark:text-gray-100 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-100">Already have an account?</p>
            <Link
              to="/auth/signin"
              className="text-sm text-cerulean-blue hover:no-underline"
            >
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
