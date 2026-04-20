import { useState, useEffect } from 'react';
import { mockCountTokens } from './mockLLM/mockLlm';

export default function TokenCounter({ input, maxTokens = 4000 }) {
  const [tokenCount, setTokenCount] = useState(0);

  useEffect(() => {
    const checkTokens = async () => {
      if (!input || !input.trim()) {
        setTokenCount(0);
        return;
      }
      try {
        const data = await mockCountTokens(input);
        setTokenCount(data.count);
      } catch (error) {
        console.error("Failed to count tokens", error);
      }
    };

    const debounce = setTimeout(checkTokens, 300);
    return () => clearTimeout(debounce);
  }, [input]);

  return (
    <div className={`text-xs text-right mb-2 px-2 transition-colors ${tokenCount > maxTokens ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
      {tokenCount} / {maxTokens} tokens
    </div>
  );
}