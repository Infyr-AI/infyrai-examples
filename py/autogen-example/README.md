## Microsoft's AutoGen AI Agents framework integration with [Infyr.AI](https://infyr.ai/)

```bash
uv sync --frozen
cp .env.example .env # then copy paste your Infyr API key in OPENAI_API_KEY=
uv run main.py # hello world agent 

# Web Agent Example
npm i # to install playwright
uv run python web-agent.py # for web agent example
# IMPORTANT NOTE: Currently Web Agent example works best with closed source models like OpenAI's GPT, O series, Claude and Gemini models. 
# Open Source models are catching up and in the future it should have parity interms of accuracy and features with closed source one for tasks that web agent needs to do.

```

Original Autogen docs - https://github.com/microsoft/autogen

**Infyr integrates with major AI frameworks with little to no code change, just replace OPENAI_BASE URL endpoint and OPENAI_API_KEY, Select model from Infyr's model catelog**


*OpenAI SDK compatibility with Chat, Vision LLMs and Embedding models only*