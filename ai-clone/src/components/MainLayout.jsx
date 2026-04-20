import { useState } from 'react';
import Chat from './Chat.jsx';
import Sidebar from './Sidebar.jsx';
import PhotoGenerator from './PhotoGenerator.jsx';

export default function MainLayout() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => Math.random().toString(36).substring(7));
  const [isPhotoMode, setIsPhotoMode] = useState(false);

  // Get the messages for the currently active session
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession ? currentSession.messages : [];

  // Custom setMessages function to update the global session state
  const setMessages = (newMessagesFn) => {
    setSessions(prevSessions => {
      const sessionExists = prevSessions.find(s => s.id === currentSessionId);
      const prevMessages = sessionExists ? sessionExists.messages : [];
      const newMessages = typeof newMessagesFn === 'function' ? newMessagesFn(prevMessages) : newMessagesFn;

      const firstUserMsg = newMessages.find(m => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '') : 'New Chat';

      if (sessionExists) {
        return prevSessions.map(s => s.id === currentSessionId ? { ...s, title, messages: newMessages } : s);
      } else {
        return [{ id: currentSessionId, title, messages: newMessages }, ...prevSessions];
      }
    });
  };

  const handleNewChat = () => {
    setCurrentSessionId(Math.random().toString(36).substring(7));
  };

  return (
    <div className="flex h-screen w-full bg-[#0d0d0e] text-[#e3e3e3] font-sans overflow-hidden">
      <Sidebar sessions={sessions} currentSessionId={currentSessionId} onSelectSession={setCurrentSessionId} onNewChat={handleNewChat} />
      <div className="flex-1 h-full flex flex-col bg-[#131314] relative">
        {/* Header */}
        <div className="bg-[#1e1f20] px-6 py-4 flex items-center justify-between border-b border-gray-800 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">Clone</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg text-gray-200">Clone Agent</h1>
            </div>
          </div>
          
          <button
            onClick={() => setIsPhotoMode(!isPhotoMode)}
            className="bg-[#2a2b2d] hover:bg-[#3a3b3d] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border border-gray-700"
          >
            {isPhotoMode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
                Back to Chat
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                Generate Photo
              </>
            )}
          </button>
        </div>
        
        {/* Chat Component */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {isPhotoMode ? (
            <PhotoGenerator />
          ) : (
            <Chat sessionId={currentSessionId} messages={messages} setMessages={setMessages} />
          )}
        </div>
      </div>
    </div>
  );
}