import { useRef, useEffect } from 'react';
import ThoughtTrace from './ThoughtTrace';

export default function ChatInput({ input, setInput, handleSend, disabled, thoughts }) {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      handleSend();
    }
  };

  // Auto-resize the textarea based on content length
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="pt-2 w-full">
      {thoughts && <ThoughtTrace thoughts={thoughts} />}
      <div className="flex items-end bg-[#1e1f20] rounded-3xl px-4 py-3 border border-gray-700 focus-within:border-gray-500 transition-colors shadow-md">
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent outline-none resize-none pt-2 pb-2 px-3 text-base md:text-lg max-h-[200px] overflow-y-auto block disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={disabled ? "Waiting for response..." : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          className="ml-3 mb-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-2.5 flex items-center justify-center text-base font-bold disabled:opacity-50 disabled:bg-gray-600 transition-colors shrink-0 shadow-sm"
          disabled={disabled || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}