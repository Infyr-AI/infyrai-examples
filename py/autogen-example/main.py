import os
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_core.models import ModelFamily
from dotenv import load_dotenv

load_dotenv()
# ONLY FOR DEBUG
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
print(f"{OPENAI_API_KEY=} {OPENAI_BASE_URL=}")
# REMOVE LINE 9-13 in actual implementation


async def main() -> None:
    model_client = OpenAIChatCompletionClient(
        model="llama4-maverick",
        model_info={
            "vision": False,
            "function_calling": True,
            "json_output": False,
            "family": ModelFamily.LLAMA_4_MAVERICK,
            "structured_output": True,
        },
    )
    agent = AssistantAgent("assistant", model_client=model_client)
    print(await agent.run(task="Say 'Hello World!'"))
    await model_client.close()


asyncio.run(main())
