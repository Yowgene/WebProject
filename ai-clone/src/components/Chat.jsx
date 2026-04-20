import { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

function Chat({ sessionId, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Calling your backend API that runs the python agent
      const res = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput, session_id: sessionId }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const aiMessage = { role: "ai", text: data.text || "I don't have a response for that." };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = { role: "ai", text: "Sorry, I'm having trouble connecting to the server. Please check if the backend is running and try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col w-full h-full bg-[#131314]">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-5xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg opacity-80">
              <span className="text-4xl font-bold text-white">AI</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">AI Assistant</h2>
            <p className="text-base text-gray-500 max-w-sm">This is the beginning of your conversation. Send a message to start chatting.</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <ChatMessage key={i} message={m} />
          ))
        )}
        {isLoading && <ChatMessage message={{ role: 'ai', text: '' }} />}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-4 md:px-6 pb-6 w-full max-w-5xl mx-auto bg-[#131314]">
        <ChatInput input={input} setInput={setInput} handleSend={handleSend} disabled={isLoading} />
      </div>
    </main>
  );
}

export default Chat;