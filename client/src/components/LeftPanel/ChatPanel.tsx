import React from "react";
import { ChatPanelProps } from "../../types/chat";
import ChatTabs from "./ChatTabs";
import ChatContent from "./ChatContent";
import ChatInput from "./ChatInput";
import Logo from "../../assets/navigator.png";

const ChatPanel: React.FC<ChatPanelProps> = ({
  isPanelVisible,
  panelWidth,
  activeChatTab,
  setActiveChatTab,
  task,
  tasks,
  setIsPanelVisible,
}) => {
  return (
    <div
      className={`${
        isPanelVisible ? `w-[${panelWidth}%]` : "w-0"
      } border-r border-gray-200 dark:border-dark-bg-secondary flex flex-col transition-all duration-300 overflow-hidden bg-ghost-white dark:bg-dark-bg-contrast fixed md:relative z-50 md:z-10 h-screen max-w-[85%] md:max-w-[30%]`}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-dark-bg-secondary">
        <a href="/" className="flex items-center gap-1">
          <img src={Logo} alt="Navigator Logo" className="w-6 h-6" />
          <h1 className="text-lg font-semibold p-0.5 text-gray-800 dark:text-gray-100 align-middle">
            Navigator
          </h1>
        </a>
        <button onClick={() => setIsPanelVisible(!setIsPanelVisible)} className="md:hidden text-sm p-1.5 rounded-lg cursor-pointer text-gray-600 dark:text-gray-500 hover:text-gray-100 dark:hover:bg-dark-bg-secondary">
          <i
            className="bx bxs-chevrons-left text-base"
            title="Close Sidebar"
          ></i>
        </button>
      </div>
      <ChatTabs
        activeChatTab={activeChatTab}
        setActiveChatTab={setActiveChatTab}
      />
      <ChatContent tasks={tasks} />
      <ChatInput task={task} />
    </div>
  );
};

export default ChatPanel;
