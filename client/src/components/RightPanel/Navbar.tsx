import { NavbarProps } from "../../types/chat";
import {
  CLOSE_SIDEBAR_TITLE,
  OPEN_SIDEBAR_TITLE,
  BROWSER_TAB_TITLE,
  CONSOLE_TAB_TITLE,
  CHEVRONS_LEFT_ICON,
  CHEVRONS_RIGHT_ICON,
  WINDOWS_ICON,
  TERMINAL_ICON,
} from "../../constants/ui";
import { BROWSER_TAB_NAME, CONSOLE_TAB_NAME } from "../../constants/tasks";

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isPanelVisible,
  setIsPanelVisible,
}) => {
  return (
    <div className="flex items-center justify-start gap-2 px-4 py-2 border-b border-gray-200 dark:border-dark-bg-secondary bg-ghost-white dark:bg-dark-bg-contrast">
      <button
        onClick={() => setIsPanelVisible(!isPanelVisible)}
        className="p-1.5 rounded-lg cursor-pointer text-gray-600 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg-secondary text-sm"
      >
        {isPanelVisible ? (
          <i
            className={`${CHEVRONS_LEFT_ICON} text-base`}
            title={CLOSE_SIDEBAR_TITLE}
          ></i>
        ) : (
          <i
            className={`${CHEVRONS_RIGHT_ICON} text-base`}
            title={OPEN_SIDEBAR_TITLE}
          ></i>
        )}
      </button>
      <button
        onClick={() => setActiveTab(BROWSER_TAB_NAME)}
        className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-2 text-sm ${
          activeTab === BROWSER_TAB_NAME
            ? "bg-gray-100 dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
        }`}
        title={BROWSER_TAB_TITLE}
      >
        <i className={`${WINDOWS_ICON} text-base`}></i> Browser
      </button>
      <button
        onClick={() => setActiveTab(CONSOLE_TAB_NAME)}
        className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-2 text-sm ${
          activeTab === CONSOLE_TAB_NAME
            ? "bg-gray-100 dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
        }`}
        title={CONSOLE_TAB_TITLE}
      >
        <i className={`${TERMINAL_ICON} text-base`}></i> Console
      </button>
    </div>
  );
};

export default Navbar;
