import asyncio
import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import SecretStr

from browser_use import Agent, BrowserConfig
from browser_use.browser.browser import Browser
from browser_use.browser.context import BrowserContextConfig

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
	raise ValueError('GEMINI_API_KEY is not set')

async def main():
    llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash-exp', api_key=SecretStr(api_key))
    browser = Browser()
    
    async with await browser.new_context() as context:        
        while True: 
            task = input("Enter the next task (or 'quit' to exit): ")
            if task.lower() == 'quit':
                break
            agent = Agent(
                task=task,
                llm=llm,
                browser_context=context
            )
            await agent.run(max_steps=25)
    await browser.close()
asyncio.run(main())