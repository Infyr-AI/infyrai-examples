## Microsoft's AutoGen AI Agents framework integration with [Infyr.AI](https://infyr.ai/)

```bash
uv sync --frozen
cp .env.example .env # then copy paste your Infyr API key in OPENAI_API_KEY=
uv run main.py
```

Original Autogen docs - https://github.com/microsoft/autogen

**Infyr integrates with major AI frameworks with little to no code change, just replace OPENAI_BASE URL endpoint and OPENAI_API_KEY, Select model from Infyr's model catelog**


*OpenAI SDK compatibility with Embedding and Chat models only*