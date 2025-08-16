// /components/ChatMessage.jsx
'use client';

import { User, Bot, BookOpen, TestTube2, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// ** THE CHANGE IS HERE: Use the absolute path alias for robustness **
import QuizComponent from '@/components/QuizComponent.jsx';

export default function ChatMessage({ message, onOptionClick, onQuizComplete }) {
  const isUser = message.role === 'user';
  const Icon = isUser ? User : Bot;
  const bgColor = isUser ? 'bg-gray-600/50' : 'bg-gray-700/50';

  if (message.contentType === 'options') {
    return (
      <div className="p-4 my-2">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 max-w-lg mx-auto">
            <p className="text-center mb-4 text-white">{message.content}</p>
            <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => onOptionClick('learn', message.topic)} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"><BookOpen size={16}/> Learn Deeply</button>
                <button onClick={() => onOptionClick('quiz', message.topic)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"><TestTube2 size={16}/> Quick Quiz</button>
                <button onClick={() => onOptionClick('test', message.topic)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"><FileText size={16}/> Take a Formal Test</button>
            </div>
        </div>
      </div>
    );
  }
  
  if (message.contentType === 'quiz_json') {
    try {
      let jsonString = message.content;
      
      const startIndex = jsonString.indexOf('{');
      const endIndex = jsonString.lastIndexOf('}');
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("No JSON object found in the AI's response.");
      }
      
      jsonString = jsonString.substring(startIndex, endIndex + 1);

      const quizData = JSON.parse(jsonString);
      
      return <QuizComponent quizData={quizData} onQuizComplete={onQuizComplete} />;
    } catch (error) {
      console.error("Failed to parse quiz JSON:", error, "Original content:", message.content);
      return <div className="text-red-400 p-4">Failed to load quiz: Could not parse quiz data from AI.</div>;
    }
  }

  return (
    <div className={`flex items-start gap-4 p-4 my-2 rounded-lg ${bgColor}`}>
      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-600"><Icon size={20} /></div>
      <div className="prose prose-invert max-w-none pt-1 text-white">
        {isUser ? (
            <div>{message.content}</div>
        ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};
