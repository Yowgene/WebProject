export default function NewChatButton({ onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2 bg-[#2a2b2d] hover:bg-[#3a3b3d] text-white p-3 rounded-xl text-sm font-medium transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      New Chat
    </button>
  );
}