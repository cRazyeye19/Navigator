import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import admin from "firebase-admin";
import config from './config/config.js';

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(config.serviceAccount)
});

import { initializeFirebase as initializeBrowserService } from './services/browserService.js';
initializeBrowserService();

import taskRoutes from './routes/taskRoutes.js';
import browserRoutes from './routes/browserRoutes.js';

// Initialize Express app
const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(bodyparser.json());

// Routes
app.use(taskRoutes);
app.use(browserRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});