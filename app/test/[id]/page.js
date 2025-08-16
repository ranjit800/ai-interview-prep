// /app/test/[id]/page.js
'use client';

// Note: 'next/navigation' is the correct import for the Next.js App Router.
// If you see an error, please ensure your Next.js version is up to date.
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LoaderCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id;

  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Uttar store karne ke liye object
  const [isSubmitting, setIsSubmitting] = useState(false); // Submit state ke liye

  useEffect(() => {
    if (testId) {
      const fetchTest = async () => {
        try {
          const res = await fetch(`/api/test/${testId}`);
          if (!res.ok) {
            throw new Error('Test fetch karne mein asamarth. Shayad yeh maujood nahi hai.');
          }
          const data = await res.json();
          setTestData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTest();
    }
  }, [testId]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const goToNextQuestion = () => {
    if (testData && currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/test/${testId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: userAnswers }),
      });

      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Test submit karne mein asamarth.');
      }

      const resultData = await res.json();
      // Natija page par redirect karein
      router.push(`/test/results/${resultData.testAttemptId}`);

    } catch (err) {
        setError(err.message);
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white"><LoaderCircle size={48} className="animate-spin" /></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400"><p>Error: {error}</p></div>;
  }

  if (!testData) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white"><p>Test data nahi mil raha hai.</p></div>;
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const totalQuestions = testData.questions.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center">{testData.topic}</h1>
          <p className="text-center text-gray-400 mt-2">Sawaal {currentQuestionIndex + 1} of {totalQuestions}</p>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.questionText}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200
                  ${userAnswers[currentQuestion._id] === option 
                    ? 'bg-blue-500/30 border-blue-500' 
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600/50'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={goToPreviousQuestion} 
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} className="mr-1"/>
            Pichla
          </button>
          
          {currentQuestionIndex === totalQuestions - 1 ? (
             <button 
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="px-6 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-800 disabled:cursor-wait"
             >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
             </button>
          ) : (
            <button 
                onClick={goToNextQuestion}
                className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500"
            >
                Agla
                <ChevronRight size={20} className="ml-1"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
