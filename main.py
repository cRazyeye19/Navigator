import requests
import asyncio
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import SecretStr, BaseModel

from browser_use import Agent, BrowserConfig
from browser_use.browser.browser import Browser
from browser_use.browser.context import BrowserContext

# Load environment variables
load_dotenv()

# Load required API keys from environment variables
ANCHOR_API_KEY = os.getenv('ANCHOR_API_KEY')
if not ANCHOR_API_KEY:
    raise ValueError('ANCHOR_API_KEY is not set')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError('GEMINI_API_KEY is not set')

# Create a new remote browser session
url = "https://api.anchorbrowser.io/api/sessions"

# Define the request payload
payload = {
    "adblock_config": {
        "active": False,
        "popup_blocking_active": False
    },
    "captcha_config": {"active": False},
    "headless": False,
    "proxy_config": {
        "type": "anchor_residential",
        "active": False
    },
    "recording": {"active": False},
    "profile": {
        "name": "my-profile",
        "persist": True,
        "store_cache": True
    },
    "viewport": {
        "width": 1440,
        "height": 900
    },
    "timeout": 10,
    "idle_timeout": 3
}

# Define the request headers
headers = {
    "anchor-api-key": ANCHOR_API_KEY,
    "Content-Type": "application/json"
}

# Send the POST request
response = requests.request("POST", url, json=payload, headers=headers)
print(response.text)

# Parse the JSON response and extract the session_id
session_data = response.json()
session_id = session_data.get("id")
if not session_id:
    raise ValueError("session_id not found in the response")

# Construct the remote endpoint URL
remote_endpoint = f"wss://connect.anchorbrowser.io?apiKey={ANCHOR_API_KEY}&sessionId={session_id}"
print("Remote endpoint:", remote_endpoint)

live_view_url = f"https://live.anchorbrowser.io/inspector.html?host=connect.anchorbrowser.io&sessionId={session_id}"
print("Live view URL:", live_view_url)
# Setup the LLM
llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash-exp', api_key=SecretStr(GEMINI_API_KEY))

# Configure the Browser
config = BrowserConfig(
	cdp_url=remote_endpoint,
	headless=False,
	disable_security=True
)
browser = Browser(config=config)

# Create the FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the request body structure
class TaskRequest(BaseModel):
    task: str

# Create an endpoint to run a task based on the frontend input
@app.post("/run-task")
async def run_task(request: TaskRequest):
    try:
        agent = Agent(
            task=request.task,
            llm=llm,
            max_actions_per_step=4,
            browser=browser,
        )
        # Run the agent's actions asynchronously
        result = await agent.run(max_steps=25)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Create an endpoint to get the live URL
@app.get("/get-live-url")
async def get_live_url():
    try:
        return {"live_url": live_view_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# If you still need to run a default task when the script is executed directly
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

