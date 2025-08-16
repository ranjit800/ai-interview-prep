// /app/api/test/results/[id]/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import TestAttempt from '@/models/TestAttempt';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // 1. User ko authenticate karein
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2. URL se test attempt ID lein
    const { id: testAttemptId } = params;

    // 3. Database se test attempt ka data nikalein
    // .populate() se hum test ka topic bhi saath mein le aayenge
    const testAttempt = await TestAttempt.findById(testAttemptId)
                                         .populate('testId', 'topic');

    // 4. Security check: Yeh attempt usi user ka hai ya nahi
    if (!testAttempt || testAttempt.userId.toString() !== userId) {
      return NextResponse.json({ message: 'Attempt not found or unauthorized' }, { status: 404 });
    }

    // 5. Result wapas bhejein
    return NextResponse.json(testAttempt, { status: 200 });

  } catch (error) {
    console.error('Fetch results error:', error);
    return NextResponse.json({ message: 'Result fetch karne mein ek error aayi.' }, { status: 500 });
  }
}
