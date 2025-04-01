import fetch from "node-fetch";
import admin from "firebase-admin";
import { getActiveSession } from "./browserService.js";

let db;

// Get Firestore instance
function initializeFirebase() {
  db = admin.firestore();
}

/**
 * Performs a web task using the Anchor Browser API
 * @param {string} sessionId - The browser session ID
 * @param {string} task - The task description
 * @param {string} taskId - The Firestore task document ID
 * @returns {Promise<string>} Task result
 */
async function performWebTask(sessionId, task, taskId) {
  if (!db) {
    initializeFirebase();
  }
  try {
    const response = await fetch(`https://connect.anchorbrowser.io/tools/perform-web-task?sessionId=${sessionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: task,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Web task result:", data);

    // Update the task document with the result
    await db.collection("tasks").doc(taskId).update({
      result: data.result,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return data.result;
  } catch (error) {
    console.log("Error performing web task:", error);
    throw error;
  }
}

/**
 * Processes a task from Firestore
 * @param {string} taskId - The Firestore task document ID
 * @returns {Promise<Object>} Session ID and task data
 */
async function processTask(taskId) {
  if (!db) {
    initializeFirebase();
  }
  const taskDoc = await db.collection("tasks").doc(taskId).get();
  if (!taskDoc.exists) {
    throw new Error("Task not found");
  }

  const taskData = taskDoc.data();
  console.log("Task found:", taskData);

  const sessionId = await getActiveSession();
  if (!sessionId) {
    throw new Error("Error creating browser session");
  }

  await db.collection("tasks").doc(taskId).update({
    status: "processing",
    startedAt: admin.firestore.FieldValue.serverTimestamp(),
    sessionId: sessionId
  });

  return { sessionId, taskData };
}

export { performWebTask, processTask, initializeFirebase };