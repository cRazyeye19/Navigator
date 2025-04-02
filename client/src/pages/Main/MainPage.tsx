import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AutomationTask } from "../../types/tasks";
import { db, auth } from "../../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import DarkMode from "../../components/Main/DarkMode";

const MainPage = () => {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const taskRef = collection(db, "tasks");
      const docRef = await addDoc(taskRef, {
        task: task,
        status: "pending",
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        displayName: user.displayName,
        photoUrl: user.photoURL,
      });

      setTask("");

      const response = await fetch("http://localhost:3000/perform-web-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId: docRef.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to perform task");
      }

      const responseData = await response.json();

      // If sessionId is immediately available in the response, use it
      if (responseData.sessionId) {
        navigate(`/tasks/${responseData.sessionId}`);
      } else {
        // Wait for sessionId to be updated in Firestore
        console.log(
          "SessionId not immediately available, waiting for Firestore update..."
        );

        // Set a maximum wait time (5 seconds)
        const maxWaitTime = 5000;
        const startTime = Date.now();

        // Create a promise that resolves when sessionId is available or timeout occurs
        const waitForSessionId = new Promise<string | null>((resolve) => {
          const unsubscribe = onSnapshot(
            doc(db, "tasks", docRef.id),
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                const taskData = docSnapshot.data();
                if (taskData.sessionId) {
                  console.log(
                    "SessionId found in Firestore:",
                    taskData.sessionId
                  );
                  unsubscribe();
                  resolve(taskData.sessionId);
                } else if (Date.now() - startTime >= maxWaitTime) {
                  console.log("Timeout waiting for sessionId");
                  unsubscribe();
                  resolve(null);
                }
              }
            }
          );

          // Set a timeout as a fallback
          setTimeout(() => {
            unsubscribe();
            resolve(null);
          }, maxWaitTime);
        });

        // Wait for the sessionId or timeout
        const sessionId = await waitForSessionId;

        if (sessionId) {
          navigate(`/tasks/${sessionId}`);
        } else {
          console.log("Using task ID as fallback");
          navigate(`/tasks/${docRef.id}`);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = async (taskText: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const taskRef = collection(db, "tasks");
      const docRef = await addDoc(taskRef, {
        task: taskText,
        status: "pending",
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        displayName: user.displayName,
        photoUrl: user.photoURL,
      });

      const response = await fetch("http://localhost:3000/perform-web-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId: docRef.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to perform task");
      }

      const responseData = await response.json();

      if (responseData.sessionId) {
        navigate(`/tasks/${responseData.sessionId}`);
      } else {
        console.log(
          "SessionId not immediately available, waiting for Firestore update..."
        );

        const maxWaitTime = 5000;
        const startTime = Date.now();

        const waitForSessionId = new Promise<string | null>((resolve) => {
          const unsubscribe = onSnapshot(
            doc(db, "tasks", docRef.id),
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                const taskData = docSnapshot.data();
                if (taskData.sessionId) {
                  console.log(
                    "SessionId found in Firestore:",
                    taskData.sessionId
                  );
                  unsubscribe();
                  resolve(taskData.sessionId);
                } else if (Date.now() - startTime >= maxWaitTime) {
                  console.log("Timeout waiting for sessionId");
                  unsubscribe();
                  resolve(null);
                }
              }
            }
          );

          setTimeout(() => {
            unsubscribe();
            resolve(null);
          }, maxWaitTime);
        });

        const sessionId = await waitForSessionId;

        if (sessionId) {
          navigate(`/tasks/${sessionId}`);
        } else {
          console.log("Using task ID as fallback");
          navigate(`/tasks/${docRef.id}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.error("Internal server error. Please try again later", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "text-sm",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth/signin");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const tasks: AutomationTask[] = [
    {
      id: 1,
      icons: <i className="bx bx-search-alt-2"></i>,
      text: "Navigate to eBay.com and find cheapest charger",
    },
    {
      id: 2,
      icons: <i className="bx bx-movie-play"></i>,
      text: 'Book a ticket on one of the "Now Showing" movies in SM Cinema',
    },
    {
      id: 3,
      icons: <i className="bx bx-paper-plane"></i>,
      text: "Track the prices and book a flight for two passengers to Singapore with Cebu Pacific",
    },
    {
      id: 4,
      icons: <i className="bx bx-food-menu"></i>,
      text: "Suggest a 30 minute meal plan with chicken that has at least 3 stars",
    },
    {
      id: 5,
      icons: <i className="bx bx-buildings"></i>,
      text: "Find best-rated hotels under $100/night in Cebu",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-ghost-white dark:bg-dark-bg-primary">
      <DarkMode />
      <div className="absolute top-4 right-4" ref={profileRef}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2.5 px-4 py-2 text-gray-600 dark:text-white dark:bg-dark-bg-primary cursor-pointer hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-7 h-7 rounded-full"
            />
          ) : (
            <i className="bx bx-user-circle text-2xl"></i>
          )}
          <span>My Profile</span>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-ghost-white dark:bg-dark-bg-secondary rounded-lg shadow-lg border border-gray-200 dark:border-dark-bg-secondary py-1">
            <div className="px-4 py-2 border-b border-gray-200 dark:bg-dark-bg-secondary">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.displayName}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary flex items-center gap-2 cursor-pointer"
            >
              <i className="bx bx-log-out"></i>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-8">
        <span className="typewriter dark:text-white">Welcome to Navigator</span>
      </h1>

      <div className="w-full max-w-2xl bg-gray-200 dark:bg-dark-bg-secondary rounded-2xl p-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              placeholder="Perform a task..."
              className="flex-grow w-full p-3 resize-none overflow-hidden bg-gray-50 dark:bg-dark-bg-primary dark:text-gray-100 placeholder-gray-400 outline-none rounded-2xl"
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  120
                )}px`;
              }}
              onFocus={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  120
                )}px`;
              }}
              rows={1}
              required
            ></textarea>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              The AI assistant can make mistakes. Consider checking important
              information.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                className="px-2.5 py-2 dark:hover:bg-dark-bg-secondary rounded-full transition-colors cursor-not-allowed opacity-50"
                title="Upload files and more (Coming Soon)"
                disabled={true}
              >
                <i className="bx bx-paperclip size-5 text-gray-400 dark:text-gray-300"></i>
              </button>
              <button
                className={`px-2.5 py-2 bg-cerulean-blue hover:bg-light-blue rounded-full transition-colors cursor-pointer ${
                  loading ? "opacity-50" : ""
                }`}
                title="Perform Task"
                disabled={loading}
              >
                <i
                  className={`bx ${
                    loading ? "bx-loader-alt animate-spin" : "bx-chevrons-up"
                  } size-5 text-gray-100 text-base`}
                ></i>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Suggested Automation Tasks
        </h2>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center p-4 bg-ghost-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-bg-secondary rounded-lg hover:outline hover:outline-light-blue cursor-pointer"
              onClick={() => handleTaskClick(task.text)}
            >
              <span className="text-xl text-cerulean-blue">{task.icons}</span>
              <span className="ml-3 dark:text-white">{task.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
