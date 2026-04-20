// Ensure these images exist in the mockLLM folder
import heroImg from '../../assets/hero.png';
import reactImg from '../../assets/react.svg';
import viteImg from '../../assets/vite.svg';

export const mockCountTokens = async (text) => {
  // A rough approximation of tokens (usually ~4 chars per token)
  return { count: Math.ceil(text.length / 4) };
};

export const mockChat = async (prompt, sessionId) => {
  // Simulate network delay for realism (1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerPrompt = prompt.toLowerCase();
  let text = `This is a mock AI response to your prompt: "${prompt}"`;
  let thoughts = "1. Received user prompt.\n2. Processing mock response.\n3. Formatting output.";

  // Provide some specific responses based on keywords
  if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
    text = "Hello there! How can I help you in this mock environment today?";
    thoughts = "* The user said hello.\n* I should respond with a friendly greeting.";
  } else if (lowerPrompt.includes("help")) {
    text = "I can help you test out the UI! Try asking me for some code.";
    thoughts = "* The user is asking for help.\n* Suggest testing out code block formatting.";
  } else if (lowerPrompt.includes("code") || lowerPrompt.includes("react")) {
    text = "Sure! Here is a quick React component example to test syntax highlighting:\n\n```jsx\nexport default function Hello() {\n  return <div>Hello World</div>;\n}\n```";
    thoughts = "* The user mentioned code.\n* Generate a simple React JSX snippet.\n* Wrap it in markdown for syntax highlighting.";
  }

  return { text, thoughts };
};

export const mockGeneratePhoto = async (prompt) => {
  // Simulate network delay for image generation (1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerPrompt = prompt.toLowerCase();
  
  // Return specific images based on prompt keywords
  if (lowerPrompt.includes("react")) {
    return reactImg;
  } else if (lowerPrompt.includes("vite")) {
    return viteImg;
  } else {
    return heroImg; // Default fallback image
  }
};