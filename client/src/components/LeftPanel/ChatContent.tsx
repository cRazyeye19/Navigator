import React from "react";
import { ChatContentProps } from "../../types/chat";
import Chat from "./Chat";
import { NO_TASKS_MESSAGE, TASK_ARRAY_INDEX_ZERO } from "../../constants/ui";

const ChatContent: React.FC<ChatContentProps> = ({ tasks = [] }) => {
  if (tasks && tasks.length > TASK_ARRAY_INDEX_ZERO) {
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
      <div className="text-center text-gray-500 dark:text-gray-100">{NO_TASKS_MESSAGE}</div>
    </div>
  );
};

export default ChatContent;
