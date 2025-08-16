// /app/dashboard/page.js
// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import { logout } from '@/store/features/auth/authSlice'; // ** Import path ko theek kiya gaya **
// import { Plus, MessageSquare, Send, User, Bot, LoaderCircle, LogOut, Menu, X, Edit, Check, BookOpen, TestTube2, FileText } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';

// // Editable Topic Component
// const EditableTopic = ({ session, onTopicUpdate }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [topic, setTopic] = useState(session.topic);
//     const inputRef = useRef(null);

//     useEffect(() => {
//         if (isEditing && inputRef.current) {
//             inputRef.current.focus();
//             inputRef.current.select();
//         }
//     }, [isEditing]);

//     const handleSave = async () => {
//         if (topic.trim() === '' || topic === session.topic) {
//             setIsEditing(false);
//             setTopic(session.topic);
//             return;
//         }
//         try {
//             await fetch(`/api/sessions/${session._id}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ topic: topic }),
//             });
//             onTopicUpdate(session._id, topic);
//             setIsEditing(false);
//         } catch (error) {
//             console.error("Failed to save topic:", error);
//             setTopic(session.topic);
//             setIsEditing(false);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') handleSave();
//         else if (e.key === 'Escape') {
//             setTopic(session.topic);
//             setIsEditing(false);
//         }
//     };

//     return (
//         <div className="flex items-center justify-between w-full group">
//             {isEditing ? (
//                 <input ref={inputRef} type="text" value={topic} onChange={(e) => setTopic(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyDown} className="bg-gray-700 text-white rounded px-1 py-0 w-full text-sm"/>
//             ) : (
//                 <span className="truncate flex-1">{topic}</span>
//             )}
//             <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 focus:opacity-100">
//                 {isEditing ? <Check size={16} /> : <Edit size={14} />}
//             </button>
//         </div>
//     );
// };

// // Chat Message Component
// const ChatMessage = ({ message, onOptionClick }) => {
//   const isUser = message.role === 'user';
//   const Icon = isUser ? User : Bot;
//   const bgColor = isUser ? 'bg-gray-600/50' : 'bg-gray-700/50';

//   if (message.contentType === 'options') {
//     return (
//       <div className="p-4 my-2">
//         <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 max-w-lg mx-auto">
//             <p className="text-center mb-4 text-white">{message.content}</p>
//             <div className="flex flex-col sm:flex-row gap-3">
//                 <button onClick={() => onOptionClick('learn', message.topic)} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"><BookOpen size={16}/> Learn Deeply</button>
//                 <button onClick={() => onOptionClick('quiz', message.topic)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"><TestTube2 size={16}/> Quick Quiz</button>
//                 <button onClick={() => onOptionClick('test', message.topic)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"><FileText size={16}/> Take a Formal Test</button>
//             </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`flex items-start gap-4 p-4 my-2 rounded-lg ${bgColor}`}>
//       <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600"><Icon size={20} /></div>
//       <div className="prose prose-invert max-w-none pt-1 text-white">
//         {isUser ? (
//             <div>{message.content}</div>
//         ) : (
//             <ReactMarkdown>{message.content}</ReactMarkdown>
//         )}
//       </div>
//     </div>
//   );
// };


// export default function DashboardPage() {
//   const { user, loading: authLoading } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [chatSessions, setChatSessions] = useState([]);
//   const [currentSessionId, setCurrentSessionId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [sessionsLoading, setSessionsLoading] = useState(true);
//   const [messagesLoading, setMessagesLoading] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const chatContainerRef = useRef(null);

//   useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading, router]);
//   useEffect(() => { if (user) fetchSessions(); }, [user]);
//   useEffect(() => { if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }, [messages]);

//   const fetchSessions = async () => {
//     setSessionsLoading(true);
//     try {
//       const res = await fetch('/api/sessions');
//       if (!res.ok) throw new Error('Failed to fetch sessions');
//       const data = await res.json();
//       setChatSessions(data);
//     } catch (error) { console.error('Error fetching sessions:', error); } 
//     finally { setSessionsLoading(false); }
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout');
//       dispatch(logout());
//       router.push('/login');
//     } catch (error) { console.error('Logout failed:', error); }
//   };

//   const handleNewChat = () => {
//     setCurrentSessionId(null);
//     setMessages([]);
//     setIsSidebarOpen(false);
//   }

//   const handleSelectSession = async (sessionId) => {
//     setCurrentSessionId(sessionId);
//     setIsSidebarOpen(false);
//     setMessagesLoading(true);
//     try {
//       const res = await fetch(`/api/messages?sessionId=${sessionId}`);
//       if (!res.ok) throw new Error('Failed to fetch messages');
//       const data = await res.json();
//       setMessages(data);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       setMessages([{ role: 'assistant', content: 'Could not load chat history.' }]);
//     } finally {
//       setMessagesLoading(false);
//     }
//   }

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;

//     const userMessage = { role: 'user', content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     const topic = input;
//     setInput('');
//     setIsLoading(true);

//     try {
//         if (!currentSessionId) {
//             const optionsMessage = {
//                 role: 'assistant',
//                 content: `Great! For the topic "${topic}", what would you like to do?`,
//                 contentType: 'options',
//                 topic: topic
//             };
//             setMessages(prev => [...prev, optionsMessage]);
//         } else {
//             const res = await fetch('/api/chat', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ sessionId: currentSessionId, message: topic }),
//             });
//             if (!res.ok) throw new Error('Failed to get response from AI');
//             const data = await res.json();
//             setMessages((prev) => [...prev, data.response]);
//         }
//     } catch (error) {
//         console.error(error);
//         const errorMessage = { role: 'assistant', content: 'Sorry, something went wrong.' };
//         setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   const handleOptionClick = async (option, topic) => {
//     setIsLoading(true);
//     setMessages(prev => prev.filter(msg => msg.contentType !== 'options'));
    
//     let prompt = '';
    
//     if (option === 'learn') {
//       prompt = `Please provide a detailed, well-structured summary on the topic of "${topic}". Use markdown for headings, bold text, and lists.`;
//     } else if (option === 'quiz') {
//       prompt = `Generate a 5-question multiple-choice quiz about "${topic}". Provide the response in a valid JSON format.`;
//     } else if (option === 'test') {
//       try {
//         const res = await fetch('/api/test/generate', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ topic }),
//         });
        
//         if (!res.ok) {
//             const errorData = await res.json().catch(() => ({ message: "An unknown error occurred." }));
//             throw new Error(errorData.message || 'Test generation failed');
//         }

//         const data = await res.json();
//         router.push(`/test/${data.testId}`);
//       } catch (error) {
//         console.error(error);
//         setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I could not generate the test. Reason: ${error.message}` }]);
//       } finally {
//         setIsLoading(false);
//       }
//       return;
//     }

//     try {
//         const res = await fetch('/api/chat', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ sessionId: currentSessionId, message: prompt }),
//         });
//         if (!res.ok) throw new Error('Failed to get response from AI');
//         const data = await res.json();
        
//         if (!currentSessionId) {
//             setCurrentSessionId(data.sessionId);
//             setChatSessions(prev => [{ _id: data.sessionId, topic: data.newTopic || topic }, ...prev]);
//         }
//         setMessages(prev => [...prev, data.response]);
//     } catch (error) {
//         console.error(error);
//         setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
//     } finally {
//         setIsLoading(false);
//     }
//   };


//   if (authLoading) {
//     return <div className="flex items-center justify-center h-screen bg-gray-900 text-white"><LoaderCircle size={48} className="animate-spin" /></div>;
//   }
  
//   return user ? (
//     <div className="flex h-screen w-full text-white bg-gray-800 font-sans">
//       {/* Sidebar */}
//       <div className={`bg-gray-900 w-72 p-4 flex-col h-full border-r border-gray-700 absolute md:relative z-20 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex`}>
//         <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">History</h2><button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={24} /></button></div>
//         <button onClick={handleNewChat} className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-2 mb-6 transition-colors"><Plus size={20} className="mr-2" /> New Chat</button>
//         <div className="flex-grow overflow-y-auto">
//           {sessionsLoading ? (<div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin"/></div>) : (
//             <ul>
//               {chatSessions.map(session => (
//                 <li key={session._id} onClick={() => handleSelectSession(session._id)} className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors mb-1 ${currentSessionId === session._id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>
//                   <MessageSquare size={16} className="mr-3" /><EditableTopic session={session} onTopicUpdate={(id, newTopic) => setChatSessions(prev => prev.map(s => s._id === id ? { ...s, topic: newTopic } : s))} />
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="border-t border-gray-700 pt-4">
//           <div className="p-2 rounded-lg"><div className="font-semibold">{user.name}</div><div className="text-sm text-gray-400">{user.points} points</div></div>
//           <button onClick={handleLogout} className="flex items-center p-2 rounded-lg hover:bg-red-800/50 cursor-pointer w-full text-red-400"><LogOut size={18} className="mr-3" /><span>Logout</span></button>
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1 flex flex-col bg-gray-800 relative">
//         <div className="md:hidden p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 flex items-center">
//             <button onClick={() => setIsSidebarOpen(true)} className="text-white mr-4"><Menu size={24}/></button>
//             <h1 className="text-lg font-semibold">{chatSessions.find(s => s._id === currentSessionId)?.topic || 'AI Prep Assistant'}</h1>
//         </div>
//         <div ref={chatContainerRef} className="flex-grow p-2 sm:p-6 overflow-y-auto">
//           {messagesLoading ? (<div className="flex items-center justify-center h-full"><LoaderCircle size={32} className="animate-spin" /></div>) : messages.length === 0 ? (
//             <div className="text-center text-gray-400 h-full flex flex-col justify-center items-center"><Bot size={48} className="mb-4 text-gray-500"/><h2 className="text-2xl font-bold text-white">AI Interview Prep Assistant</h2><p>Start a new conversation by typing below.</p></div>
//           ) : (
//             messages.map((msg, index) => <ChatMessage key={index} message={msg} onOptionClick={handleOptionClick} />)
//           )}
//           {isLoading && <div className="flex justify-center p-4"><LoaderCircle className="animate-spin text-blue-500"/></div>}
//         </div>
//         <div className="p-4 border-t border-gray-700">
//           <form onSubmit={handleSendMessage} className="bg-gray-900/50 border border-gray-700 rounded-lg flex items-center p-2">
//             <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a topic for your interview..." className="w-full bg-transparent focus:outline-none px-2 text-white" disabled={isLoading}/>
//             <button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-lg p-2 ml-2 transition-colors disabled:bg-gray-500" disabled={isLoading || !input.trim()}><Send size={20} className="text-white"/></button>
//           </form>
//         </div>
//       </div>
//     </div>
//   ) : null;
// }









// /app/dashboard/page.js
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
// ** Import path ko theek kiya gaya **
import { logout, setUserOnLogin } from '../../store/features/auth/authSlice';
import { LoaderCircle } from 'lucide-react';

// ** Import path ko theek kiya gaya **
import Sidebar from '../../components/Sidebar.jsx';
import ChatWindow from '../../components/ChatWindow.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';

export default function DashboardPage() {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatContainerRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const sortSessions = (sessions) => {
    return [...sessions].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  };

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await fetch('/api/sessions');
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setChatSessions(sortSessions(data));
    } catch (error) { console.error('Error fetching sessions:', error); } 
    finally { setSessionsLoading(false); }
  }, []);

  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading, router]);
  useEffect(() => { if (user) fetchSessions(); }, [user, fetchSessions]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout');
      dispatch(logout());
      router.push('/login');
    } catch (error) { console.error('Logout failed:', error); }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  }

  const handleSelectSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    setIsSidebarOpen(false);
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/messages?sessionId=${sessionId}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([{ role: 'assistant', content: 'Could not load chat history.' }]);
    } finally {
      setMessagesLoading(false);
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const topic = input;
    setInput('');
    setIsLoading(true);
    try {
        if (!currentSessionId) {
            const optionsMessage = { role: 'assistant', content: `Great! For the topic "${topic}", what would you like to do?`, contentType: 'options', topic: topic };
            setMessages(prev => [...prev, optionsMessage]);
        } else {
            const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: currentSessionId, message: topic, isQuiz: false }), });
            if (!res.ok) throw new Error('Failed to get response from AI');
            const data = await res.json();
            setMessages((prev) => [...prev, data.response]);
            await fetchSessions();
        }
    } catch (error) {
        console.error(error);
        const errorMessage = { role: 'assistant', content: 'Sorry, something went wrong.' };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleOptionClick = async (option, topic) => {
    setIsLoading(true);
    setMessages(prev => prev.filter(msg => msg.contentType !== 'options'));
    let prompt = '';
    let isQuiz = false;
    if (option === 'learn') {
      prompt = `Please provide a detailed, well-structured summary on the topic of "${topic}". Use markdown for headings, bold text, and lists.`;
    } else if (option === 'quiz') {
      prompt = `Generate a 5-question multiple-choice quiz about "${topic}". The entire response must be a single JSON object with a key "questions" which is an array of 5 objects. Each object must have "questionText", "options" (an array of 4 strings), and "correctAnswer".`;
      isQuiz = true;
    } else if (option === 'test') {
      try {
        const res = await fetch('/api/test/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic }), });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: "An unknown error occurred." }));
            throw new Error(errorData.message || 'Test generation failed');
        }
        const data = await res.json();
        router.push(`/test/${data.testId}`);
      } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I could not generate the test. Reason: ${error.message}` }]);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    try {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: currentSessionId, message: prompt, isQuiz }), });
        if (!res.ok) throw new Error('Failed to get response from AI');
        const data = await res.json();
        if (!currentSessionId) {
            setCurrentSessionId(data.sessionId);
            await fetchSessions();
        }
        setMessages(prev => [...prev, data.response]);
    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleTopicUpdate = async (sessionId, newTopic) => {
    try {
        await fetch(`/api/sessions/${sessionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: newTopic }),
        });
        setChatSessions(prevSessions =>
          sortSessions(prevSessions.map(session =>
            session._id === sessionId ? { ...session, topic: newTopic, updatedAt: new Date().toISOString() } : session
          ))
        );
    } catch (error) {
        console.error("Failed to save topic:", error);
    }
  };
  
  const handleQuizComplete = async (pointsAwarded) => {
    if (!user) return;
    const updatedUser = { ...user, points: user.points + pointsAwarded };
    dispatch(setUserOnLogin(updatedUser));
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
        const res = await fetch(`/api/sessions/${sessionToDelete._id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to delete the session.");
        
        setChatSessions(prev => prev.filter(s => s._id !== sessionToDelete._id));
        if (currentSessionId === sessionToDelete._id) {
            setCurrentSessionId(null);
            setMessages([]);
        }
    } catch (error) {
        console.error(error);
        alert("Error: Could not delete the chat session.");
    } finally {
        setIsModalOpen(false);
        setSessionToDelete(null);
    }
  };

  const handlePinSession = async (sessionId, newPinState) => {
    try {
        await fetch(`/api/sessions/${sessionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pinned: newPinState }),
        });
        setChatSessions(prevSessions =>
          sortSessions(prevSessions.map(session =>
            session._id === sessionId ? { ...session, pinned: newPinState } : session
          ))
        );
    } catch (error) {
        console.error("Failed to pin session:", error);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white"><LoaderCircle size={48} className="animate-spin" /></div>;
  }
  
  return user ? (
    <>
      <div className="flex h-screen w-full text-white bg-gray-800 font-sans">
        <Sidebar
          user={user}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          handleNewChat={handleNewChat}
          sessionsLoading={sessionsLoading}
          chatSessions={chatSessions}
          handleSelectSession={handleSelectSession}
          currentSessionId={currentSessionId}
          handleTopicUpdate={handleTopicUpdate}
          handleLogout={handleLogout}
          handleDeleteClick={handleDeleteClick}
          handlePinSession={handlePinSession}
        />
        <ChatWindow
          setIsSidebarOpen={setIsSidebarOpen}
          currentTopic={chatSessions.find(s => s._id === currentSessionId)?.topic || 'AI Prep Assistant'}
          chatContainerRef={chatContainerRef}
          messagesLoading={messagesLoading}
          messages={messages}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
          input={input}
          setInput={setInput}
          handleOptionClick={handleOptionClick}
          handleQuizComplete={handleQuizComplete}
        />
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Chat"
        message={`Are you sure you want to permanently delete the chat "${sessionToDelete?.topic}"?`}
      />
    </>
  ) : null;
}
