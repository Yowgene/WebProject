/*
This server file sets up an Express backend that integrates with the @google/adk agent. It defines a POST endpoint at /api/chat that receives user messages, runs the agent to generate a response, and returns that response to the frontend. The server also uses CORS to allow cross-origin requests from the frontend and dotenv to manage environment variables securely.
*/
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { rootAgent } from '../my-agent/agent'; // Make sure the path matches your structure
import { Runner, InMemorySessionService, isFinalResponse, BaseAgent } from '@google/adk';

const app = express();
app.use(cors());
app.use(express.json());

// Set up the session service and runner for the ADK agent
const sessionService = new InMemorySessionService();
const runner = new Runner({
  agent: rootAgent as unknown as BaseAgent,
  appName: 'chatbot-app',
  sessionService: sessionService
});

// Integrated chat endpoint using the @google/adk agent
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  
  try {
    const userId = 'user-123';
    const sessionId = 'session-123';

    // Ensure a session exists
    try {
      await sessionService.createSession({ appName: 'chatbot-app', userId, sessionId });
    } catch (e) {
      // Session might already exist
    }

    let reply = 'Sorry, no response generated.';

    // The ADK uses an async iterator (Runner.runAsync) to stream events
    for await (const event of runner.runAsync({ userId, sessionId, newMessage: { role: 'user', parts: [{ text: message }] } })) {
      if (isFinalResponse(event)) {
        // Depending on your ADK version, the text might be in event.text or event.content
        reply = (event as any).text || (event as any).content?.parts?.[0]?.text || reply;
      }
    }
    
    res.json({ reply });
  } catch (error) {
    console.error('Agent execution error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ reply: `Agent error: ${errorMessage}` });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend chatbot server running on port ${PORT}`);
});