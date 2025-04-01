<div align="center">
  <h1><img src="client/src/assets/navigator.png" alt="Navigator Logo" width="50" style="vertical-align: middle;" /> Navigator</h1>
</div>

Navigator is an AI-powered web automation assistant that helps users perform tasks on the web through natural language commands. The application combines a modern React frontend with a Node.js backend and leverages the Anchor Browser API for web automation capabilities.

## Features

- **Natural Language Task Processing**: Simply describe what you want to do on the web, and Navigator will execute it
- **Live Browser View**: Watch in real-time as Navigator performs tasks in a browser window
- **Chat Interface**: User-friendly conversational UI for submitting tasks and viewing results
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing
- **Firebase Integration**: User authentication and task history storage
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Task History**: View and manage your previous tasks
- **Real-time Updates**: See task progress and results as they happen

## Project Structure

The project is organized into two main components:

### Client (Frontend)

- Built with React 19, TypeScript, and Vite
- Uses Tailwind CSS for styling
- Firebase for authentication and data storage
- Real-time updates with Firebase hooks

### Server (Backend)

- Node.js with Express
- Integrates with Anchor Browser API for web automation
- Handles task processing and browser session management
- Communicates with the frontend via REST API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Anchor Browser API key
- Google Gemini API key (for Python implementation)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/navigator.git
   cd navigator

   ```

2. Install dependencies for both client and server:

   ```bash
    # Install client dependencies
    cd client
    npm install

    # Install server dependencies
    cd ../server
    npm install

   ```

3. Set up environment variables:
   Create a .env file in the root directory with the following variables:

   ```bash
    ANCHOR_API_KEY=your_anchor_api_key
    PORT=3000
    GOOGLE_CREDENTIALS=./config/serviceAccountKey.json
   For the Python test script, you'll also need:

   ```

4. Set up Firebase:

- Create a Firebase project at firebase.google.com
- Generate a service account key and save it to server/config/serviceAccountKey.json
- Update the .firebaserc file with your Firebase project ID
- Enable Firestore and Authentication in your Firebase project

5. Start the development servers:

In the server directory:

```bash
node script.js
```

In the client directory:

```bash
npm run dev
```

6. Open your browser and navigate to http://localhost:5173

## Usage

1. Sign in with your Firebase account
2. Type a task in the chat input (e.g., "Search for the latest news about AI")
3. Click "Send" to submit the task
4. Watch as Navigator performs the task in the browser view
5. View the results in the chat interface
6. Use the dark/light mode toggle in the bottom left corner to change the theme

## Technologies Used

### Frontend

- React 19 : Modern UI library for building interactive user interfaces
- TypeScript : Adds static typing to JavaScript for better code quality
- Vite : Fast build tool and development server
- Tailwind CSS 4 : Utility-first CSS framework for rapid UI development
- Firebase : Authentication and Firestore database
- React Router : For navigation and routing
- React Toastify : For displaying notifications
- React Firebase Hooks : For real-time data synchronization
- BoxIcons : Icon library for UI elements

### Backend

- Node.js : JavaScript runtime for server-side code
- Express : Web framework for Node.js
- Firebase Admin SDK : Server-side Firebase integration
- Anchor Browser API : For web automation and browser control
- Cors : For handling cross-origin requests
- Dotenv : For environment variable management
-

### Additional Tools

- ESLint : For code linting and quality control
- TypeScript ESLint : TypeScript integration for ESLint
- Python : Alternative implementation with LangChain
- Google Gemini : AI model for natural language processing
- Playwright : For browser automation testing

## How It Works

1. Task Submission : User submits a task through the chat interface
2. Task Storage : Task is stored in Firebase Firestore
3. Browser Session : Server creates or reuses an Anchor Browser session
4. Task Execution : Server sends the task to Anchor Browser for execution
5. Result Retrieval : Results are fetched and stored in Firestore
6. Real-time Updates : Client receives updates in real-time via Firebase

### Browser Session Management

The server manages browser sessions efficiently:

- Reuses existing sessions when available
- Creates new sessions when needed
- Handles concurrent requests with a queue system
- Stores session information in Firestore for persistence

### Task Processing Flow

1. User submits a task from the client
2. Task is stored in Firestore with status "pending"
3. Client sends a request to the server with the task ID
4. Server retrieves the task from Firestore
5. Server updates task status to "processing"
6. Server sends the task to Anchor Browser for execution
7. Anchor Browser performs the task and returns results
8. Server updates the task in Firestore with results and status "completed"
9. Client displays the results in real-time via Firebase listeners

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch ( git checkout -b feature/amazing-feature )
3. Commit your changes ( git commit -m 'Add some amazing feature' )
4. Push to the branch ( git push origin feature/amazing-feature )
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
