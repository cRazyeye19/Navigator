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

const serviceAccountPath = resolve(rootDir, process.env.GOOGLE_CREDENTIALS);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

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