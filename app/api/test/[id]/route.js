// /app/api/test/[id]/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Test from '@/models/Test';

// This function will handle GET requests to fetch a specific test
export async function GET(request, { params }) {
  try {
    await dbConnect();

    // 1. Authenticate the user
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    jwt.verify(token, process.env.JWT_SECRET); // We just need to verify, not use the payload

    // 2. Get the test ID from the dynamic route parameter
    const { id: testId } = params;

    // 3. Find the test in the database by its ID
    // IMPORTANT SECURITY: We exclude the 'correctAnswer' from each question.
    // This prevents the user from cheating by looking at the network request.
    const test = await Test.findById(testId).select({
      'questions.correctAnswer': 0,
    });

    if (!test) {
      return NextResponse.json({ message: 'Test not found' }, { status: 404 });
    }

    // 4. Return the test data (without the answers)
    return NextResponse.json(test, { status: 200 });

  } catch (error) {
    console.error('Fetch test error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { message: 'An error occurred while fetching the test.' },
      { status: 500 }
    );
  }
}
