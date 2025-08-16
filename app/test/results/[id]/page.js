// /app/test/results/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LoaderCircle, CheckCircle2, XCircle, Award, Home } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id;

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (attemptId) {
      const fetchResults = async () => {
        try {
          const res = await fetch(`/api/test/results/${attemptId}`);
          if (!res.ok) throw new Error('Result fetch karne mein asamarth.');
          const data = await res.json();
          setResults(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [attemptId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white"><LoaderCircle size={48} className="animate-spin" /></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400"><p>Error: {error}</p></div>;
  }

  if (!results) {
    return null;
  }

  const totalQuestions = results.answers.length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-400">Test Results</h1>
          <p className="text-xl text-gray-300 mt-2">{results.testId.topic}</p>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12">
            <div className="flex flex-col items-center">
              <p className="text-5xl font-bold text-green-400">{results.score} / {totalQuestions}</p>
              <p className="text-gray-400">Aapka Score</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-5xl font-bold text-yellow-400 flex items-center gap-2">
                <Award size={40}/> +{results.pointsAwarded}
              </p>
              <p className="text-gray-400">Points Mile</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Aapke Jawab</h2>
          <div className="space-y-6">
            {results.answers.map((ans, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${ans.isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                <p className="font-semibold text-lg mb-2">{index + 1}. {ans.questionText}</p>
                <p className={`text-sm ${ans.isCorrect ? 'text-gray-300' : 'text-red-400 line-through'}`}>
                  Aapka Jawab: {ans.userAnswer}
                </p>
                {!ans.isCorrect && (
                  <p className="text-sm text-green-400">Sahi Jawab: {ans.correctAnswer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8">
            <Link href="/dashboard" className="inline-flex items-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                <Home size={20} className="mr-2"/>
                Dashboard par Wapas Jayein
            </Link>
        </div>
      </div>
    </div>
  );
}
