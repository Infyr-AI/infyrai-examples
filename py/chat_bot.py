import streamlit as st
import json
from datetime import datetime
import requests
from openai import OpenAI

# Set up the page configuration
st.set_page_config(page_title="Infyr.AI Chatbot", page_icon="💬")

# Initialize session state variables
if "messages" not in st.session_state:
    st.session_state.messages = []

if "api_key" not in st.session_state:
    st.session_state.api_key = ""

if "models" not in st.session_state:
    st.session_state.models = []


# Function to fetch available models from Infyr.AI
def fetch_models(api_key):
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        response = requests.get(
            "https://api.infyr.ai/api/models?per_page=30", headers=headers
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        st.error(f"Error fetching models: {str(e)}")
        return {"models": []}


# Sidebar for API key input
with st.sidebar:
    st.title("Infyr.AI Chatbot")
    api_key = st.text_input("Enter your Infyr.AI API key:", type="password")

    if api_key and api_key != st.session_state.api_key:
        st.session_state.api_key = api_key
        # Fetch models when API key is entered or changed
        with st.spinner("Fetching available models..."):
            models_data = fetch_models(api_key)
            if "models" in models_data and models_data["models"]:
                # Extract model names from the response
                st.session_state.models = [
                    model["name"] for model in models_data["models"]
                ]

    if st.session_state.models:
        model = st.selectbox("Select model:", st.session_state.models)
    else:
        model = st.text_input("Model ID (models not loaded)")

    temperature = st.slider(
        "Temperature:", min_value=0.0, max_value=2.0, value=0.7, step=0.1
    )

    if st.button("Clear conversation"):
        st.session_state.messages = []
        st.rerun()

# Main chat interface
st.title("Chat with Infyr.AI")

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])

# Input for new message
if prompt := st.chat_input("Type your message here..."):
    if not st.session_state.api_key:
        st.error("Please enter your Infyr.AI API key in the sidebar.")
        st.stop()

    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Display user message
    with st.chat_message("user"):
        st.write(prompt)

    # Display assistant response with a spinner
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""

        try:
            # Initialize OpenAI client with Infyr.AI base URL
            client = OpenAI(
                base_url="https://api.infyr.ai/v1",
                api_key=st.session_state.api_key,
            )

            # Call Infyr.AI API using OpenAI SDK
            stream = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": m["role"], "content": m["content"]}
                    for m in st.session_state.messages
                ],
                temperature=temperature,
                stream=True,
            )

            # Stream the response
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    message_placeholder.write(full_response + "▌")

            message_placeholder.write(full_response)

            # Add assistant response to chat history
            st.session_state.messages.append(
                {"role": "assistant", "content": full_response}
            )

        except Exception as e:
            st.error(f"Error: {str(e)}")

# Add timestamp and app info at the bottom
st.caption(f"Current time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
