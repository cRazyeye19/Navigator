import { useDarkMode } from "../../contexts/ThemeContext";
import { LIGHT_MODE_TITLE, DARK_MODE_TITLE, SUN_ICON, MOON_ICON } from "../../constants/ui";

const DarkMode = () => {
  const context = useDarkMode();

  if (!context) return null;

  const { darkMode, setDarkMode } = context;
  return (
    <div className="fixed bottom-4 left-4 z-10">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="flex items-center justify-center size-10 bg-ghost-white dark:bg-dark-bg-primary rounded-full shadow-md hover:shadow-lg dark:hover:bg-dark-bg-secondary transition-shadow cursor-pointer"
        title={darkMode ? LIGHT_MODE_TITLE : DARK_MODE_TITLE}
      >
        {darkMode ? (
          <i className={`${SUN_ICON} text-cerulean-blue dark:text-white`}></i>
        ) : (
          <i className={`${MOON_ICON} text-cerulean-blue dark:text-white`}></i>
        )}
      </button>
    </div>
  );
};

export default DarkMode;
