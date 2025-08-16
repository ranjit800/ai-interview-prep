// /components/ChatWindow.jsx
'use client';

import { useRef, useEffect } from 'react';
import { Menu, Bot, LoaderCircle, Send } from 'lucide-react';
// ** THE CHANGE IS HERE: Use a relative path since it's in the same folder **
import ChatMessage from './ChatMessage.jsx';

export default function ChatWindow({
    setIsSidebarOpen,
    currentTopic,
    chatContainerRef,
    messagesLoading,
    messages,
    isLoading,
    handleSendMessage,
    input,
    setInput,
    handleOptionClick,
    handleQuizComplete
}) {
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, chatContainerRef]);

  return (
    <div className="flex-1 flex flex-col bg-gray-800 relative">
        <div className="md:hidden p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="text-white mr-4"><Menu size={24}/></button>
            <h1 className="text-lg font-semibold">{currentTopic}</h1>
        </div>
        <div ref={chatContainerRef} className="flex-grow p-2 sm:p-6 overflow-y-auto">
          {messagesLoading ? (<div className="flex items-center justify-center h-full"><LoaderCircle size={32} className="animate-spin" /></div>) : messages.length === 0 ? (
            <div className="text-center text-gray-400 h-full flex flex-col justify-center items-center"><Bot size={48} className="mb-4 text-gray-500"/><h2 className="text-2xl font-bold text-white">AI Interview Prep Assistant</h2><p>Select a past conversation or start a new one.</p></div>
          ) : (
            messages.map((msg, index) => <ChatMessage key={index} message={msg} onOptionClick={handleOptionClick} onQuizComplete={handleQuizComplete} />)
          )}
          {isLoading && <div className="flex justify-center p-4"><LoaderCircle className="animate-spin text-blue-500"/></div>}
        </div>
        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="bg-gray-900/50 border border-gray-700 rounded-lg flex items-center p-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a topic for your interview..." className="w-full bg-transparent focus:outline-none px-2 text-white" disabled={isLoading}/>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-lg p-2 ml-2 transition-colors disabled:bg-gray-500" disabled={isLoading || !input.trim()}><Send size={20} className="text-white"/></button>
          </form>
        </div>
    </div>
  );
}
