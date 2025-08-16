// /app/api/test/[id]/submit/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Test from '@/models/Test';
import TestAttempt from '@/models/TestAttempt';
import User from '@/models/User';

export async function POST(request, { params }) {
  try {
    await dbConnect();

    // 1. User ko authenticate karein
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { id: testId } = params;
    const { answers: userAnswers } = await request.json();

    // 2. Database se sahi jawab ke saath poora test fetch karein
    const test = await Test.findById(testId);
    if (!test) {
      return NextResponse.json({ message: 'Test not found' }, { status: 404 });
    }

    let correctAnswersCount = 0;
    const processedAnswers = [];

    // 3. User ke jawab ko sahi jawab se compare karein
    test.questions.forEach(question => {
      const questionIdStr = question._id.toString();
      const userAnswer = userAnswers[questionIdStr];
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        correctAnswersCount++;
      }

      processedAnswers.push({
        questionText: question.questionText,
        userAnswer: userAnswer || 'Not Answered',
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
      });
    });

    // 4. Score aur points calculate karein
    const totalQuestions = test.questions.length;
    const score = correctAnswersCount;
    // Har sahi jawab ke liye 10 points dein (aap is logic ko badal sakte hain)
    const pointsAwarded = correctAnswersCount * 10;

    // 5. Naya test attempt record banayein
    const newTestAttempt = new TestAttempt({
      testId,
      userId,
      answers: processedAnswers,
      score,
      pointsAwarded,
      status: 'completed',
      completedAt: new Date(),
    });
    await newTestAttempt.save();

    // 6. User ke total points update karein
    await User.findByIdAndUpdate(userId, { $inc: { points: pointsAwarded } });

    // 7. Naye attempt ki ID wapas bhejein
    return NextResponse.json({
      message: 'Test submitted successfully!',
      testAttemptId: newTestAttempt._id,
    }, { status: 200 });

  } catch (error) {
    console.error('Submit test error:', error);
    return NextResponse.json({ message: 'Test submit karne mein ek error aayi.' }, { status: 500 });
  }
}
