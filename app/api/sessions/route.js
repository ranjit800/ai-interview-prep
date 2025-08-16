// /app/api/sessions/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';

export async function GET(request) {
  try {
    await dbConnect();

    // 1. Authenticate the user
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2. Find all chat sessions for the authenticated user
    // Sort by 'updatedAt' in descending order to show the most recent chats first
    const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 });

    // 3. Return the list of sessions
    return NextResponse.json(sessions, { status: 200 });

  } catch (error) {
    console.error('Fetch sessions error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { message: 'An error occurred while fetching sessions.' },
      { status: 500 }
    );
  }
}
