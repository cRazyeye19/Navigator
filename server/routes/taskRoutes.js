import express from 'express';
import admin from 'firebase-admin';
import { processTask, performWebTask, initializeFirebase } from '../services/taskService.js';

const router = express.Router();
let db;
// Get Firestore instance
function initialize() {
    db = admin.firestore();
    initializeFirebase();
}
/**
 * POST /perform-web-task
 * Processes a web task
 */
router.post('/perform-web-task', async (req, res) => {
    const { taskId } = req.body;
    try {
        initialize();
        const { sessionId, taskData } = await processTask(taskId);

        // Start processing the task (don't await here to respond faster)
        performWebTask(sessionId, taskData.task, taskId)
            .then(() => {
                db.collection('tasks').doc(taskId).update({
                    status: 'completed',
                    completedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            })
            .catch(error => {
                console.error("Error in performWebTask:", error);
                db.collection('tasks').doc(taskId).update({
                    status: 'failed',
                    error: error.message,
                    failedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            });
        // Return the sessionId to the client
        res.json({
            message: 'Task received and is being processed',
            sessionId: sessionId
        });
    } catch (error) {
        console.error(error);
        if (taskId) {
            await db.collection('tasks').doc(taskId).update({
                status: 'failed',
                error: error.message,
                failedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        res.status(500).send("Error processing task");
    }
});

export default router;