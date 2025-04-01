import express from 'express';
import { getLiveViewUrl } from '../services/browserService.js';

const router = express.Router();
/**
 * GET /get-live-url
 * Returns the live view URL for the current browser session
 */
router.get('/get-live-url', async (req, res) => {
    try {
        const liveUrl = await getLiveViewUrl();
        res.json({ live_url: liveUrl });
    } catch (error) {
        console.error('Error getting live view URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;