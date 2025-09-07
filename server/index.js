import fetch from "node-fetch";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";
// Load environment variables
dotenv.config();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse the service account file
const serviceAccountPath = resolve(__dirname, process.env.GOOGLE_CREDENTIALS);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparser.json());

let lastSessionData = null;
let sessionCreationInProgress = false;

const browserConfiguration = {
  adblock_config: { active: true },
  captcha_config: { active: true },
  proxy_config: { active: true },
  headless: false,
  timeout: 10,
  idle_timeout: 30,
};

const ANCHOR_API_KEY = process.env.ANCHOR_API_KEY;

async function getActiveSession() {
  try {
    // Get all active sessions from the API
    const activeSessionsResponse = await fetch(
      "https://api.anchorbrowser.io/api/sessions/active",
      {
        method: "GET",
        headers: {
          "anchor-api-key": ANCHOR_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (activeSessionsResponse.ok) {
      const activeSessions = await activeSessionsResponse.json();
      console.log("Active sessions:", activeSessions);

      // Check if our last known session is in the active sessions list
      if (lastSessionData && lastSessionData.id) {
        const isSessionActive = activeSessions.some(
          (session) =>
            session.session_id === lastSessionData.id &&
            session.status === "running"
        );

        if (isSessionActive) {
          console.log("Reusing existing browser session:", lastSessionData.id);
          return lastSessionData.id;
        } else {
          console.log("Last session is not active anymore");
        }
      }

      // If we have active sessions but our last known session is not among them
      if (activeSessions && activeSessions.length > 0) {
        // Sort by creation date (newest first)
        activeSessions.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        // Use the most recent active session
        const mostRecentSession = activeSessions[0];
        console.log(
          "Using most recent active session:",
          mostRecentSession.session_id
        );

        // Since we can't get the live_view_url from the active sessions endpoint,
        // we need to check if we have this session in Firestore
        const sessionQuery = await db
          .collection("browserSessions")
          .where("id", "==", mostRecentSession.session_id)
          .limit(1)
          .get();

        if (!sessionQuery.empty) {
          // We found the session in Firestore
          const sessionDoc = sessionQuery.docs[0];
          const sessionData = sessionDoc.data();
          lastSessionData = {
            id: sessionData.id,
            live_view_url: sessionData.live_view_url,
          };
          console.log("Found session details in Firestore");
          return mostRecentSession.session_id;
        } else {
          // We don't have this session in Firestore, so we can't get the live_view_url
          // We'll need to create a new session
          console.log(
            "Session found but no details in Firestore, creating new session"
          );
          return await createBrowserSession();
        }
      }
    } else {
      console.log(
        "Failed to get active sessions, status code:",
        activeSessionsResponse.status
      );
    }

    // If no active sessions found or API call failed, create a new one
    console.log("No active sessions found, creating a new one...");
    return await createBrowserSession();
  } catch (error) {
    console.log("Error getting active session:", error);
    return await createBrowserSession();
  }
}

async function createBrowserSession() {
  if (sessionCreationInProgress) {
    console.log("Session creation already in progress, waiting...");
    while (sessionCreationInProgress) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (lastSessionData && lastSessionData.id) {
      try {
        const activeSessionsResponse = await fetch(
          "https://api.anchorbrowser.io/api/sessions/active",
          {
            method: "GET",
            headers: {
              "anchor-api-key": ANCHOR_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (activeSessionsResponse.ok) {
          const activeSessions = await activeSessionsResponse.json();
          const isSessionActive = activeSessions.some(
            (session) =>
              session.session_id === lastSessionData.id &&
              session.status === "running"
          );

          if (isSessionActive) {
            console.log(
              "Reusing session created by another request:",
              lastSessionData.id
            );
            return lastSessionData.id;
          }
        }
      } catch (error) {
        console.log("Error checking session status:", error);
      }
      console.log("Reusing stored browser session:", lastSessionData.id);
      return lastSessionData.id;
    }
  }

  sessionCreationInProgress = true;

  try {
    console.log("Creating new browser session...");
    const response = await fetch("https://api.anchorbrowser.io/api/sessions", {
      method: "POST",
      headers: {
        "anchor-api-key": ANCHOR_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(browserConfiguration),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Browser session created:", data);
    lastSessionData = data;

    await db.collection("browserSessions").add({
      id: data.id,
      live_view_url: data.live_view_url,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      configuration: browserConfiguration,
    });

    return data.id;
  } catch (error) {
    console.log("Error creating browser session:", error);
    return null;
  } finally {
    sessionCreationInProgress = false;
  }
}

async function performWebTask(sessionId, task, taskId) {
  try {
    const response = await fetch(
      `https://connect.anchorbrowser.io/tools/perform-web-task?sessionId=${sessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: task,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Web task result:", data);

    // Update the task document with the result
    await db.collection("tasks").doc(taskId).update({
      result: data.result,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.log("Error performing web task:", error);
  }
}

app.post("/perform-web-task", async (req, res) => {
  const { taskId } = req.body;
  try {
    const taskDoc = await db.collection("tasks").doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).send("Task not found");
    }

    const taskData = taskDoc.data();
    console.log("Task found:", taskData);
    const sessionId = await getActiveSession();
    if (sessionId) {
      await db.collection("tasks").doc(taskId).update({
        status: "processing",
        startedAt: admin.firestore.FieldValue.serverTimestamp(),
        sessionId: sessionId,
      });
      // await performWebTask(sessionId, taskData.task, taskId);

      // await db.collection('tasks').doc(taskId).update({
      //     status: 'completed',
      //     completedAt: admin.firestore.FieldValue.serverTimestamp()
      // });

      // res.json({ message: 'Task received and is being processed' });
      // Start processing the task (don't await here to respond faster)
      performWebTask(sessionId, taskData.task, taskId)
        .then(() => {
          db.collection("tasks").doc(taskId).update({
            status: "completed",
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        })
        .catch((error) => {
          console.error("Error in performWebTask:", error);
          db.collection("tasks").doc(taskId).update({
            status: "failed",
            error: error.message,
            failedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        });

      // Return the sessionId to the client
      res.json({
        message: "Task received and is being processed",
        sessionId: sessionId,
      });
    } else {
      res.status(500).send("Error creating browser session.");
    }
  } catch (error) {
    console.error(error);
    if (taskId) {
      await db.collection("tasks").doc(taskId).update({
        status: "failed",
        error: error.message,
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(500).send("Error processing task");
  }
});

app.get("/get-live-url", async (req, res) => {
  try {
    if (!lastSessionData || !lastSessionData.live_view_url) {
      const sessionId = await getActiveSession();
      if (!sessionId) {
        return res.status(500).send("Error creating browser session.");
      }

      if (!lastSessionData || !lastSessionData.live_view_url) {
        console.log("No live_view_url available, creating new session");
        await createBrowserSession();
        if (!lastSessionData || !lastSessionData.live_view_url) {
          return res.status(500).send("Error getting live URL.");
        }
      }
    }
    res.json({ live_url: lastSessionData.live_view_url });
  } catch (error) {
    console.error("Error getting live URL:", error);
    res.status(500).send("Error getting live URL");
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
