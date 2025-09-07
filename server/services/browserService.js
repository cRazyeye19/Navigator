import fetch from "node-fetch";
import admin from "firebase-admin";
import config from "../config/config.js";

// State variables
let lastSessionData = null;
let sessionCreationInProgress = false;
let db;

// Get Firestore instance
function initializeFirebase() {
  db = admin.firestore();
}

/**
 * Gets an active browser session or creates a new one
 * @returns {Promise<string|null>} Session ID
 */
async function getActiveSession() {
  if (!db) {
    initializeFirebase();
  }
  try {
    // Get all active sessions from the API
    const activeSessionsResponse = await fetch(
      "https://api.anchorbrowser.io/api/sessions/active",
      {
        method: "GET",
        headers: {
          "anchor-api-key": config.anchorAPIKey,
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

        // Check if we have this session in Firestore
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
          // We don't have this session in Firestore, create a new one
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

/**
 * Creates a new browser session
 * @returns {Promise<string|null>} Session ID
 */
async function createBrowserSession() {
  if (!db) {
    initializeFirebase();
  }
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
              "anchor-api-key": config.anchorAPIKey,
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
        "anchor-api-key": config.anchorAPIKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config.browserConfiguration),
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
      configuration: config.browserConfiguration,
    });

    return data.id;
  } catch (error) {
    console.log("Error creating browser session:", error);
    return null;
  } finally {
    sessionCreationInProgress = false;
  }
}

/**
 * Gets the live view URL for the current session
 * @returns {Promise<string>} Live view URL
 */
async function getLiveViewUrl() {
  if (!db) {
    initializeFirebase();
  }
  if (!lastSessionData || !lastSessionData.live_view_url) {
    const sessionId = await getActiveSession();
    if (!sessionId) {
      throw new Error("Error creating browser session.");
    }

    if (!lastSessionData || !lastSessionData.live_view_url) {
      console.log("No live_view_url available, creating new session");
      await createBrowserSession();
      if (!lastSessionData || !lastSessionData.live_view_url) {
        throw new Error("Error getting live URL.");
      }
    }
  }
  return lastSessionData.live_view_url;
}

export {
  getActiveSession,
  createBrowserSession,
  getLiveViewUrl,
  initializeFirebase,
};
