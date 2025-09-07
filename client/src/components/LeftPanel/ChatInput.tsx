import React, { useState } from "react";
import { ChatInputProps } from "../../types/chat";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  DEFAULT_API_URL,
  PERFORM_WEB_TASK_ENDPOINT,
  CONTENT_TYPE_HEADER,
  APPLICATION_JSON_HEADER,
} from "../../constants/api";
import {
  TASKS_COLLECTION,
  TASK_FIELD,
  STATUS_FIELD,
  CREATED_AT_FIELD,
  USER_ID_FIELD,
  USER_EMAIL_FIELD,
  DISPLAY_NAME_FIELD,
  PHOTO_URL_FIELD,
  PARENT_TASK_ID_FIELD,
  PENDING_STATUS,
} from "../../constants/firestore";
import {
  INPUT_PLACEHOLDER,
  ATTACH_FILE_TITLE,
  PAPERCLIP_ICON,
  STOP_TASK_TITLE,
  SEND_TASK_TITLE,
  STOP_BUTTON_TEXT,
  SEND_BUTTON_TEXT,
  SUBMIT_BUTTON_TYPE,
} from "../../constants/ui";
import {
  TEXT_INPUT_TYPE,
  ABORT_ERROR_NAME,
} from "../../constants/auth";

const API_URL = `${
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
}${PERFORM_WEB_TASK_ENDPOINT}`;

const ChatInput: React.FC<ChatInputProps> = ({ task }) => {
  const [inputTask, setInputTask] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [user] = useAuthState(auth);
  let abortController = new AbortController();

  const sendTask = async () => {
    if (!inputTask.trim() || !user) return;

    try {
      // First, create a subtask in Firestore
      setIsSending(true);
      const taskRef = collection(db, TASKS_COLLECTION);

      const taskData = {
        [TASK_FIELD]: inputTask,
        [STATUS_FIELD]: PENDING_STATUS,
        [CREATED_AT_FIELD]: serverTimestamp(),
        [USER_ID_FIELD]: user.uid,
        [USER_EMAIL_FIELD]: user.email,
        [DISPLAY_NAME_FIELD]: user.displayName,
        [PHOTO_URL_FIELD]: user.photoURL,
      };

      // Only add parentTaskId if task.id exists
      if (task && task.id) {
        Object.assign(taskData, { [PARENT_TASK_ID_FIELD]: task.id });
      }

      const docRef = await addDoc(taskRef, taskData);

      console.log("Subtask created with ID: ", docRef.id);

      // Then send it to the server
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          [CONTENT_TYPE_HEADER]: APPLICATION_JSON_HEADER,
        },
        body: JSON.stringify({
          taskId: docRef.id,
        }),
        signal: abortController.signal,
      });

      if (response.ok) {
        setInputTask("");
        console.log("Task sent successfully");
      }

      const data = await response.json();
      console.log("Task result:", data);
    } catch (error: unknown) {
      if ((error as Error).name === ABORT_ERROR_NAME) {
        console.log("Task aborted");
      } else {
        console.log("Error:", error);
        setInputTask("");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) {
      abortController.abort();
      abortController = new AbortController();
      setIsSending(false);
    } else {
      sendTask();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-dark-bg-secondary flex gap-2">
      <div className="flex-1 relative">
        <input
          type={TEXT_INPUT_TYPE}
          placeholder={INPUT_PLACEHOLDER}
          className="w-full pl-2 py-2 border dark:text-gray-100 dark:bg-dark-bg-secondary border-gray-200 dark:border-dark-bg-secondary rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-cerulean-blue focus:border-transparent dark:placeholder-gray-500"
          value={inputTask}
          onChange={(e) => setInputTask(e.target.value)}
        />
        {/* <textarea
          placeholder="Perform a task..."
          className="w-full pl-2 py-2 border dark:text-gray-100 dark:bg-dark-bg-secondary border-gray-200 dark:border-dark-bg-secondary rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-cerulean-blue focus:border-transparent dark:placeholder-gray-500 resize-none overflow-hidden min-h-[38px] max-h-[120px]"
          value={inputTask}
          onChange={(e) => {
            setInputTask(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          onFocus={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          rows={1}
        ></textarea> */}
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          title={ATTACH_FILE_TITLE}
        >
          <i className={`${PAPERCLIP_ICON} text-gray-400`}></i>
        </button>
      </div>
      <button
        type={SUBMIT_BUTTON_TYPE}
        className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
          isSending
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-cerulean-blue text-white hover:bg-light-blue"
        }`}
        onClick={handleSubmit}
        title={isSending ? STOP_TASK_TITLE : SEND_TASK_TITLE}
        disabled={!inputTask.trim()}
      >
        {isSending ? STOP_BUTTON_TEXT : SEND_BUTTON_TEXT}
      </button>
    </div>
  );
};

export default ChatInput;
