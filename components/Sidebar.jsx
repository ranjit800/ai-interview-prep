// /components/Sidebar.jsx
'use client';

import { Plus, MessageSquare, LoaderCircle, LogOut, X, Pin } from 'lucide-react';
// ** THE CHANGE IS HERE: Use a relative path since it's in the same folder **
import ChatOptions from './ChatOptions.jsx';

export default function Sidebar({
    user,
    isSidebarOpen,
    setIsSidebarOpen,
    handleNewChat,
    sessionsLoading,
    chatSessions,
    handleSelectSession,
    currentSessionId,
    handleTopicUpdate,
    handleLogout,
    handleDeleteClick,
    handlePinSession
}) {
  return (
    <div className={`bg-gray-900 w-72 p-4 flex-col h-full border-r border-gray-700 absolute md:relative z-20 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex`}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">History</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <button onClick={handleNewChat} className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-2 mb-6 transition-colors"><Plus size={20} className="mr-2" /> New Chat</button>
        <div className="flex-grow overflow-y-auto">
          {sessionsLoading ? (<div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin"/></div>) : (
            <ul>
              {chatSessions.map(session => (
                <li key={session._id} onClick={() => handleSelectSession(session._id)} className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors mb-1 ${currentSessionId === session._id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>
                  {session.pinned && <Pin size={14} className="mr-2 text-yellow-400 flex-shrink-0"/>}
                  {!session.pinned && <MessageSquare size={14} className="mr-2 flex-shrink-0"/>}
                  <ChatOptions 
                    session={session} 
                    onTopicUpdate={handleTopicUpdate} 
                    onDeleteClick={handleDeleteClick}
                    onPinSession={handlePinSession}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-gray-700 pt-4">
          <div className="p-2 rounded-lg"><div className="font-semibold">{user.name}</div><div className="text-sm text-gray-400">{user.points} points</div></div>
          <button onClick={handleLogout} className="flex items-center p-2 rounded-lg hover:bg-red-800/50 cursor-pointer w-full text-red-400"><LogOut size={18} className="mr-3" /><span>Logout</span></button>
        </div>
    </div>
  );
}
