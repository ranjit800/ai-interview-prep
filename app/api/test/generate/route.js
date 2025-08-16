// /app/api/test/generate/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Test from '@/models/Test';
import { GoogleGenerativeAI, GoogleGenerativeAIError } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request) {
  try {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { topic } = await request.json();
    if (!topic) {
      return NextResponse.json({ message: 'Topic is required' }, { status: 400 });
    }

    const prompt = `
      You are an expert question creator for technical interviews.
      Generate a formal test with around 25 important, multiple-choice questions about the topic: "${topic}".
      Each question must have exactly 4 options.
      One of the options must be the correct answer.

      The JSON structure must be an object with a single key "questions", which is an array of question objects.
      Each question object must have three keys: "questionText", "options" (an array of 4 strings), and "correctAnswer" (a string that exactly matches one of the options).
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    const parsedData = JSON.parse(responseText);

    // ** THE CHANGE IS HERE: Make the check more flexible **
    // Ab hum check karenge ki 'questions' ek array hai aur usmein kam se kam 1 question hai.
    if (!parsedData.questions || !Array.isArray(parsedData.questions) || parsedData.questions.length === 0) {
        throw new Error("AI did not return any questions in the expected format.");
    }

    const newTest = new Test({
      topic: topic,
      questions: parsedData.questions,
      generatedBy: userId,
    });
    await newTest.save();

    return NextResponse.json({ 
        message: 'Test generated successfully', 
        testId: newTest._id 
    }, { status: 201 });

  } catch (error) {
    console.error('Test generation error:', error);
    if (error instanceof GoogleGenerativeAIError) {
        return NextResponse.json(
            { message: 'Google AI server is currently busy or unavailable. Please try again in a moment.' },
            { status: 503 }
        );
    }
    return NextResponse.json(
      { message: error.message || 'An error occurred while generating the test.' },
      { status: 500 }
    );
  }
}
