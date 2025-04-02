import React, { useState } from "react";
import { ChatInputProps } from "../../types/chat";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:3000"
}/perform-web-task`;

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
      const taskRef = collection(db, "tasks");

      const taskData = {
        task: inputTask,
        status: "pending",
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        displayName: user.displayName,
        photoUrl: user.photoURL,
      };

      // Only add parentTaskId if task.id exists
      if (task && task.id) {
        Object.assign(taskData, { parentTaskId: task.id });
      }

      const docRef = await addDoc(taskRef, taskData);

      console.log("Subtask created with ID: ", docRef.id);

      // Then send it to the server
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      if ((error as Error).name === "AbortError") {
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
          type="text"
          placeholder="Perform a task..."
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
          title="Attach a file"
        >
          <i className="bx bx-paperclip text-gray-400"></i>
        </button>
      </div>
      <button
        type="submit"
        className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
          isSending
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-cerulean-blue text-white hover:bg-light-blue"
        }`}
        onClick={handleSubmit}
        title={isSending ? "Stop task" : "Send task"}
        disabled={!inputTask.trim()}
      >
        {isSending ? "Stop" : "Send"}
      </button>
    </div>
  );
};

export default ChatInput;
