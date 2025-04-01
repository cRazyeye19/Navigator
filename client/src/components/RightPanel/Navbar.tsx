import { NavbarProps } from "../../types/chat";

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
            className="bx bxs-chevrons-left text-base"
            title="Close Sidebar"
          ></i>
        ) : (
          <i
            className="bx bxs-chevrons-right text-base"
            title="Open Sidebar"
          ></i>
        )}
      </button>
      <button
        onClick={() => setActiveTab("browser")}
        className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-2 text-sm ${
          activeTab === "browser"
            ? "bg-gray-100 dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
        }`}
        title="Browser"
      >
        <i className="bx bx-windows text-base"></i> Browser
      </button>
      <button
        onClick={() => setActiveTab("console")}
        className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-2 text-sm ${
          activeTab === "console"
            ? "bg-gray-100 dark:bg-dark-bg-secondary text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
        }`}
        title="Console"
      >
        <i className="bx bx-terminal text-base"></i> Console
      </button>
    </div>
  );
};

export default Navbar;
