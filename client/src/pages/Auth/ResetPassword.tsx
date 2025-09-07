import React from "react";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { auth } from "../../config/firebase";
import Logo from "../../assets/navigator.png";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  AUTH_USER_NOT_FOUND,
  AUTH_INVALID_EMAIL,
  USER_NOT_FOUND_ERROR,
  INVALID_EMAIL_FORMAT_ERROR,
  GENERIC_ERROR_MESSAGE,
  PASSWORD_RESET_EMAIL_SENT_MESSAGE,
  RESET_PASSWORD_TITLE,
  RESET_PASSWORD_INSTRUCTION,
  EMAIL_ADDRESS_LABEL,
  EMAIL_PLACEHOLDER,
  SEND_RESET_LINK_BUTTON_TEXT,
  RETURN_TO_SIGN_IN_LINK_TEXT,
  CHECK_EMAIL_TITLE,
  CHECK_EMAIL_INSTRUCTION,
  RETURN_TO_SIGN_IN_BUTTON_TEXT,
  EMAIL_INPUT_TYPE,
  NAME_INPUT_TYPE,
} from "../../constants/auth";
import { HOME_ROUTE, AUTH_SIGN_IN_ROUTE } from "../../constants/routes";
import { NAVIGATOR_LOGO_ALT, NAVIGATOR_TITLE } from "../../constants/app";
import { MAX_WIDTH_AUTH_FORM, LOGO_SIZE, SUBMIT_BUTTON_TYPE } from "../../constants/ui";
import { TOAST_OPTIONS } from "../../constants/toast";

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
      toast.success(PASSWORD_RESET_EMAIL_SENT_MESSAGE, TOAST_OPTIONS);
    } catch (error) {
      const firebaseError = error as FirebaseError;

      if (firebaseError.code === AUTH_USER_NOT_FOUND) {
        setEmailError(USER_NOT_FOUND_ERROR);
        toast.error(USER_NOT_FOUND_ERROR, TOAST_OPTIONS);
      } else if (firebaseError.code === AUTH_INVALID_EMAIL) {
        setEmailError(INVALID_EMAIL_FORMAT_ERROR);
        toast.error(INVALID_EMAIL_FORMAT_ERROR, TOAST_OPTIONS);
      } else {
        setEmailError(GENERIC_ERROR_MESSAGE);
        toast.error(GENERIC_ERROR_MESSAGE, TOAST_OPTIONS);
      }
      console.error(firebaseError);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-ghost-white dark:bg-dark-bg-primary">
      <div className={`w-full max-w-[${MAX_WIDTH_AUTH_FORM}px] mx-4`}>
        <Link
          to={HOME_ROUTE}
          className="flex items-center justify-center align-middle mb-8"
        >
          <img src={Logo} alt={NAVIGATOR_LOGO_ALT} className={`w-${LOGO_SIZE} h-${LOGO_SIZE}`} />
          <p className="mx-2 mt-1 text-4xl font-bold text-cerulean-blue">
            {NAVIGATOR_TITLE}
          </p>
        </Link>

        {!isEmailSent ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
              {RESET_PASSWORD_TITLE}
            </h2>
            <p className="text-sm text-center text-gray-400 mb-4">
              {RESET_PASSWORD_INSTRUCTION}
            </p>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 dark:text-gray-100"
              >
                {EMAIL_ADDRESS_LABEL}
              </label>
              <input
                type={EMAIL_INPUT_TYPE}
                name={NAME_INPUT_TYPE}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={EMAIL_PLACEHOLDER}
                className="w-full px-3 py-2 dark:text-white border border-gray-200 dark:border-dark-bg-secondary dark:bg-dark-bg-secondary rounded focus:outline-none focus:border-cerulean-blue placeholder-gray-600"
                required
              />
              {emailError &&
                toast.error(emailError, TOAST_OPTIONS)}
            </div>

            <button
              type={SUBMIT_BUTTON_TYPE}
              className="w-full bg-cerulean-blue text-white py-2 rounded hover:bg-light-blue transition-colors cursor-pointer"
            >
              {SEND_RESET_LINK_BUTTON_TEXT}
            </button>

            <div className="text-center mt-4">
              <Link
                to={AUTH_SIGN_IN_ROUTE}
                className="text-sm text-cerulean-blue hover:no-underline"
              >
                {RETURN_TO_SIGN_IN_LINK_TEXT}
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {CHECK_EMAIL_TITLE}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {CHECK_EMAIL_INSTRUCTION} <strong className="dark:text-gray-100">{email}</strong>.
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
            <button
              onClick={() => navigate(AUTH_SIGN_IN_ROUTE)}
              className="w-full bg-cerulean-blue text-white py-2 rounded hover:no-underline dark:hover:no-underline cursor-pointer mt-4"
            >
              {RETURN_TO_SIGN_IN_BUTTON_TEXT}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
