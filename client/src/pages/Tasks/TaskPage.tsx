import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import ChatPanel from "../../components/LeftPanel/ChatPanel";
import Navbar from "../../components/RightPanel/Navbar";
import Browser from "../../components/RightPanel/Browser";
import { Task } from "../../types/tasks";

const TaskPage = () => {
  // const [isRecording, setIsRecording] = useState(true);
  const { id } = useParams();
  const [user] = useAuthState(auth);
  // const [task, setTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("browser");
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [panelWidth] = useState(30);
  const [activeChatTab, setActiveChatTab] = useState("chat");

  useEffect(() => {
    if (!id || !user) return;

    const fetchTask = async () => {
      try {
        const tasksQuery = query(
          collection(db, "tasks"),
          where("sessionId", "==", id),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(tasksQuery);
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];

        console.log("Query results:", tasksData);

        if (querySnapshot.empty) {
          const taskDoc = doc(db, "tasks", id);
          const unsubscribe = onSnapshot(taskDoc, (doc) => {
            if (doc.exists()) {
              const taskData = doc.data() as Task;
              if (taskData.userId === user.uid) {
                // setTask(taskData);
                setTasks(tasksData);
                console.log("Task found by ID:", taskData);
              }
            } else {
              setError("Task not found");
            }
            setLoading(false);
          });

          return () => unsubscribe();
        } else {
          setTasks(tasksData);
          // setTask(tasksData[0]);

          const sessionTasksQuery = query(
            collection(db, "tasks"),
            where("sessionId", "==", id),
            where("userId", "==", user.uid)
          );

          const unsubscribe = onSnapshot(sessionTasksQuery, (snapshot) => {
            const updatedTasks = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Task[];

            setTasks(updatedTasks);
            // if (updatedTasks.length > 0) {
            //   setTask(updatedTasks[0]);
            // }
            setLoading(false);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching task", error);
        setError("Error fetching task");
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative flex h-screen bg-ghost-white dark:bg-dark-bg-primary">
      <ChatPanel
        isPanelVisible={isPanelVisible}
        panelWidth={panelWidth}
        activeChatTab={activeChatTab}
        setActiveChatTab={setActiveChatTab}
        task={tasks.length > 0 ? tasks[0] : null}
        tasks={tasks}
        setIsPanelVisible={setIsPanelVisible}
      />
      <div className="flex-1 flex flex-col">
        <Navbar
          isPanelVisible={isPanelVisible}
          setIsPanelVisible={setIsPanelVisible}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          // task={task}
          tasks={tasks}
        />
        <Browser />
      </div>
    </div>
  );
};

export default TaskPage;
