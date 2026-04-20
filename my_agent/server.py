from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import root_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
import uuid
import asyncio
from google.genai import types
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow requests from your React frontend

# Set up the runner for the agent
session_service = InMemorySessionService()
runner = Runner(
    agent=root_agent,
    app_name="my_agent_app",
    session_service=session_service
)

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.get_json(silent=True) or {}
        prompt = data.get('prompt')
        session_id = data.get('session_id', str(uuid.uuid4()))

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        logging.info(f"Invoking agent with prompt: {prompt}")

        async def run_agent():
            try:
                await session_service.create_session(
                    app_name="my_agent_app",
                    session_id=session_id,
                    user_id="default_user"
                )
            except Exception as e:
                logging.warning(f"Session creation skipped or failed: {e}")

            content = types.Content(role="user", parts=[types.Part(text=prompt)])
            response_text = ""
            debug_events = []

            try:
                async for event in runner.run_async(session_id=session_id, user_id="default_user", new_message=content):
                    debug_events.append(type(event).__name__)

                    if hasattr(event, 'error_message') and event.error_message:
                        response_text = f"Agent Error: {event.error_message}"

                    # Safely capture text and intentionally wait for the loop to finish naturally
                    try:
                        if getattr(event, 'content', None) and getattr(event.content, 'parts', None):
                            if event.content.parts[0].text:
                                response_text = event.content.parts[0].text
                        elif getattr(event, 'message', None) and getattr(event.message, 'content', None) and getattr(event.message.content, 'parts', None):
                            if event.message.content.parts[0].text:
                                response_text = event.message.content.parts[0].text
                    except Exception as e:
                        logging.warning(f"Could not extract text from event: {e}")
                        
                if not response_text:
                    return f"Agent did not provide text. Events seen: {', '.join(debug_events)}"
                return response_text
            except Exception as e:
                logging.error(f"API or Background Error: {e}")
                return f"API Error: {str(e)}"

        response_text = asyncio.run(run_agent())
                
        logging.info(f"Agent response: {response_text}")
        return jsonify({'text': response_text})
    except Exception as e:
        logging.error(f"Error during agent invocation: {e}", exc_info=True)
        return jsonify({'error': 'An error occurred on the server'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)