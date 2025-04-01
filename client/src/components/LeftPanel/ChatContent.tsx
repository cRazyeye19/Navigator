import React from "react";
import { ChatContentProps } from "../../types/chat";
import Chat from "./Chat";

const ChatContent: React.FC<ChatContentProps> = ({ tasks = [] }) => {
  if (tasks && tasks.length > 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full max-w-full">
        {tasks.map((taskItem) => (
          <Chat key={taskItem.id} task={taskItem} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full max-w-full">
      <div className="text-center text-gray-500 dark:text-gray-100">No tasks available</div>
    </div>
  );
};

export default ChatContent;
