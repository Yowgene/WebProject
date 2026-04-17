/*
This chatbot component is a React functional component that provides a simple chat interface for users to interact with a backend chatbot server. It manages the state of the chat window, user messages, and loading status. When a user sends a message, it makes a POST request to the backend API, receives the chatbot's response, and updates the chat history accordingly. The component also includes auto-scrolling to ensure the latest messages are visible and handles errors gracefully by displaying an error message in the chat if the backend request fails.
*/
import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      console.error('Chatbot fetch error:', error);
      setMessages([...newMessages, { sender: 'bot', text: 'Error connecting to chat server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>💬 Chat</button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Help Assistant</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>{msg.text}</div>
            ))}
            {isLoading && <div className="message bot">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()} placeholder="Type a message..." disabled={isLoading} />
            <button onClick={sendMessage} disabled={isLoading}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}