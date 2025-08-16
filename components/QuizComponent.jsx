// /components/QuizComponent.jsx
'use client';

import { useState } from 'react';
import { Award, Check, X } from 'lucide-react';

export default function QuizComponent({ quizData, onQuizComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quizData.questions || quizData.quiz?.questions;

  if (!questions || questions.length === 0) {
    return <div className="text-red-400 p-4">Invalid quiz data provided.</div>;
  }

  const currentQuestion = {
    questionText: questions[currentQuestionIndex].questionText || questions[currentQuestionIndex].question,
    options: questions[currentQuestionIndex].options,
    correctAnswer: questions[currentQuestionIndex].correctAnswer || questions[currentQuestionIndex].answer,
  };

  const calculateAndFinish = (finalAnswers) => {
    let finalScore = 0;
    questions.forEach((q, index) => {
        const correctAnswer = q.correctAnswer || q.answer;
        if (finalAnswers[index]?.selected === correctAnswer) {
            finalScore++;
        }
    });
    setScore(finalScore);
    onQuizComplete(finalScore * 10);
    setIsFinished(true);
  };

  const handleAnswerSelect = (selectedOption) => {
    if (userAnswers[currentQuestionIndex]) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const newAnswers = { ...userAnswers, [currentQuestionIndex]: { selected: selectedOption, isCorrect } };
    setUserAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        calculateAndFinish(newAnswers);
      }
    }, 1200);
  };

  if (isFinished) {
    const pointsAwarded = score * 10;
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-green-500 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Quiz Complete!</h2>
        <p className="text-4xl font-bold text-green-400">{score} / {questions.length}</p>
        <p className="text-gray-300 mb-4">Aapke {score} jawab sahi the.</p>
        <div className="flex items-center justify-center gap-2 text-yellow-400 text-2xl font-bold">
          <Award size={30} /> +{pointsAwarded} Points
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
      <div className="mb-4">
        <p className="text-gray-400 text-sm">Sawaal {currentQuestionIndex + 1} of {questions.length}</p>
        <h3 className="text-lg font-semibold text-white mt-1">{currentQuestion.questionText}</h3>
      </div>
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const answerState = userAnswers[currentQuestionIndex];
          let buttonClass = 'bg-gray-700 border-gray-600 hover:bg-gray-600/50';
          if (answerState && answerState.selected === option) {
            const isCorrect = answerState.selected === currentQuestion.correctAnswer;
            buttonClass = isCorrect ? 'bg-green-500/30 border-green-500' : 'bg-red-500/30 border-red-500';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!answerState}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 flex justify-between items-center disabled:cursor-not-allowed ${buttonClass}`}
            >
              <span>{option}</span>
              {answerState && answerState.selected === option && (
                (answerState.selected === currentQuestion.correctAnswer) ? <Check size={20} className="text-green-400" /> : <X size={20} className="text-red-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
