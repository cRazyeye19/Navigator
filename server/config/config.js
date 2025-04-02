import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);

const browserConfiguration = {
    adblock_config: { active: true },
    captcha_config: { active: true },
    proxy_config: { active: true },
    headless: false,
    timeout: 120,
    idle_timeout: 30,
};

// const serviceAccountPath = resolve(rootDir, process.env.GOOGLE_CREDENTIALS);
// const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
let serviceAccount;
try {
    if (process.env.GOOGLE_CREDENTIALS && process.env.GOOGLE_CREDENTIALS.startsWith('{')) {
        serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } else {
        const serviceAccountPath = resolve(rootDir, process.env.GOOGLE_CREDENTIALS);
        serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    }
} catch (error) {
    console.error('Error parsing service account credentials:', error);
    throw error;
}

export default {
    port: process.env.PORT || 3000,
    anchorAPIKey: process.env.ANCHOR_API_KEY,
    browserConfiguration,
    serviceAccount,
    firebaseConfig: {
        credential: {
            cert: serviceAccount
        }
    }
}