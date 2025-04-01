import { ChatTabsProps } from "../../types/chat";

const ChatTabs: React.FC<ChatTabsProps> = ({ activeChatTab, setActiveChatTab }) => {
  return (
    <div className="flex px-4 py-1 border-b border-gray-200 dark:border-dark-bg-secondary">
      {["chat", "recorded Steps"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveChatTab(tab)}
          className={`px-4 py-2.5 text-sm font-medium cursor-pointer transition-all duration-200 relative ${
            activeChatTab === tab
              ? "text-cerulean-blue"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100"
          }`}
        >
          <div className="flex items-center gap-2">
            {tab === "chat" ? (
              <i className='bx bx-message-square-dots'></i>
            ) : (
              <i className='bx bx-history'></i>
            )}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
          {activeChatTab === tab && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cerulean-blue"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ChatTabs;
