import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ThoughtTrace from './ThoughtTrace';

// A simple avatar component
const Avatar = ({ role }) => (
  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
    {role === 'user' ? 'U' : 'AI'}
  </div>
);

// Loading animation component
const LoadingDots = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
  </div>
);

// Custom component for rendering code blocks
const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative my-4 rounded-md bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400 bg-[#1e1f20] rounded-t-md">
        <span>{match[1]}</span>
        <button onClick={handleCopy} className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          {isCopied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="bg-gray-800 rounded-sm px-1 py-0.5" {...props}>
      {children}
    </code>
  );
};

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  // If message is from AI and has no text, show loading animation
  if (!isUser && !message.text) {
    return (
      <motion.div className="flex flex-row w-full mb-6 gap-3 items-end justify-start">
        <Avatar role="ai" />
        <div className="px-5 py-4 bg-[#1e1f20] rounded-2xl rounded-bl-sm">
          <LoadingDots />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      // ADDED: flex-row to ensure it stays horizontal
      className={`flex flex-row w-full mb-6 gap-3 items-end ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && <Avatar role="ai" />}
      <div className={`px-5 py-3 rounded-2xl max-w-[85%] sm:max-w-[75%] overflow-x-auto ${isUser ? 'bg-blue-600 text-white rounded-br-sm shadow-md' : 'bg-[#1e1f20] text-[#e3e3e3] rounded-bl-sm shadow-sm'}`}>
        {!isUser && message.thoughts && <ThoughtTrace thoughts={message.thoughts} />}
        {/* ADDED: text-left to prevent text from being centered by parent wrappers */}
        <div className={`prose max-w-none text-left ${isUser ? 'prose-invert prose-p:leading-relaxed' : 'prose-invert'}`}>
          <ReactMarkdown components={{ 
            code: CodeBlock,
            img: ({node, ...props}) => <img {...props} className="rounded-xl shadow-sm max-h-[400px] object-contain bg-[#131416]/50 mt-3" />
          }}>
            {message.text}
          </ReactMarkdown>
        </div>
      </div>
      {isUser && <Avatar role="user" />}
    </motion.div>
  );
}