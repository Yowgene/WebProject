import { useState, useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { mockGeneratePhoto } from './mockLLM/mockLlm';

export default function PhotoGenerator() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const currentInput = input;
    const userMessage = { role: "user", text: currentInput };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const url = await mockGeneratePhoto(currentInput);
      const aiMessage = { 
        role: "ai", 
        text: `Here is your generated image:\n\n![Generated Image](${url})` 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to generate photo:", error);
      const errorMessage = { role: "ai", text: "Sorry, I encountered an error while generating the photo." };
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
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Image Generator</h2>
            <p className="text-base text-gray-500 max-w-sm">Describe the image you want to generate (try 'react' or 'vite').</p>
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