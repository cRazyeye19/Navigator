import React from "react";
import { Task } from "../../types/tasks";
import Avatar from "../../assets/cat.png";
import BotLogo from "../../assets/navigator.png";

const Chat: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <>
      <div className="flex items-start gap-3">
        <div className="bg-cerulean-blue text-gray-100 text-base px-4 py-2 rounded-lg w-full text-left flex items-center gap-2 overflow-hidden max-w-full">
          <p className="break-words overflow-hidden text-ellipsis w-full">
            {task.task}
          </p>
        </div>
        <div className="size-9 shrink-0 rounded-full bg-gray-100 dark:bg-dark-bg-secondary flex items-center justify-center">
          <img
            src={task.photoUrl || Avatar}
            alt={task.displayName || "User"}
            className="size-7 rounded-full"
          />
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <div className="size-9 shrink-0 rounded-full bg-gray-100 dark:bg-dark-bg-secondary flex items-center justify-center">
          <img src={BotLogo} alt="Bot" className="size-7 rounded-full" />
        </div>
        {task.result ? (
          <div className="bg-gray-100 dark:bg-dark-bg-secondary px-4 py-2 rounded-lg flex-1 text-gray-600 dark:text-gray-100 text-base max-w-full">
            <p className="break-words overflow-hidden text-ellipsis w-full">
              {task.result}
            </p>
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-dark-bg-secondary px-4 py-2 rounded-lg flex-1 max-w-full animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-dark-bg-primary rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-dark-bg-primary rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-dark-bg-primary rounded w-2/3"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
