import requests
import asyncio
import os
import json

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import SecretStr
from browser_use import BrowserConfig
from browser_use import Agent, Browser
from browser_use.browser.context import BrowserContextConfig
from playwright.async_api import BrowserContext

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
	raise ValueError('GEMINI_API_KEY is not set')

llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash-exp', api_key=SecretStr(api_key))

url = "https://api.anchorbrowser.io/v1/sessions"

payload = {
    "session": {
        "recording": {"active": False},
        "proxy": {
            "type": "anchor_residential",
            "active": False
        },
        "timeout": {
            "max_duration": 10,
            "idle_timeout": 5
        },
        "live_view": {"read_only": False}
    },
    "browser": {
        "profile": {
            "name": "my-profile",
            "persist": True,
            "store_cache": True
        },
        "adblock": {"active": False},
        "popup_blocker": {"active": False},
        "captcha_solver": {"active": False},
        "headless": {"active": True},
        "viewport": {
            "width": 1440,
            "height": 900
        }
    }
}
headers = {
    "anchor-api-key": "sk-6d6462f866c1f368acddbecc1242ffe0",
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers)

print(response.text)

response_data = json.loads(response.text)
session_id = response_data["data"]["id"]
api_key = headers["anchor-api-key"]

browser_config = BrowserConfig(
    headless=True,
    cdp_url=f"wss://connect.anchorbrowser.io?apiKey={api_key}&sessionId={session_id}",
    disable_security=True,
)

# context_config = BrowserContextConfig(
#    browser_window_size={'width': 1280, 'height': 1100}, 
#     wait_for_network_idle_page_load_time=3.0,
# )

browser = Browser(config=browser_config)
# context = BrowserContext()

async def run_agent():
    agent = Agent(
        task="What is the weather like in New York?",
        llm=llm,
        # browser_context=context,
        browser=browser,
    )

    await agent.run(max_steps=10)

if __name__ == "__main__":
    asyncio.run(run_agent())