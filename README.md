# Full-Stack AI Chatbot Project

This is a full-stack web application featuring a React frontend, an Express backend, and an integrated AI chatbot powered by Google's Gemini model and the `@google/adk`.

## Project Structure

This project is set up as an npm workspaces monorepo:

- **/frontend**: A React application built with Vite. It contains the main UI and the floating `Chatbot` component.
- **/backend**: An Express API server that handles chat requests and communicates with the AI agent.
- **/my-agent**: Contains the `@google/adk` AI agent configuration and tools.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm
- A Gemini API Key

## Setup Instructions

1. **Install Dependencies**
   From the root of the project, run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env ()
   GEMINI_API_KEY="your_api_key_here"
   ```
   Change `.env.example` to `.env` and replace the placeholder with your actual Gemini API key. This configuration file allows the application backend to securely authenticate and communicate with the Gemini AI model.

## Running the Application

You will need to run the frontend and backend simultaneously in separate terminal windows.

**1. Start the Backend Server**
```bash
npm run dev:backend
```
*The backend server will start on `http://localhost:3001`.*

**2. Start the Frontend App**
```bash
npm run dev:frontend
```
*The Vite development server will start (usually on `http://localhost:5173`).*

## Features
- **Floating Chat UI**: A responsive, bottom-right chatbot window with auto-scrolling and loading states.
- **Agentic AI Engine**: Backend powered by `@google/adk` `Runner` and `InMemorySessionService` for contextual conversations.
- **Monorepo Setup**: Shared dependencies across the entire stack using npm workspaces.

## Future Improvements
**1. Implement tailwind.css**
**2. Improve chatbot, add database server**
**3. Implement multi-agent or change chatbot focus/range**