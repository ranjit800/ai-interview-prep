// /app/api/messages/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
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

    // 2. Get the sessionId from the URL query parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ message: 'Session ID is required' }, { status: 400 });
    }

    // 3. Security Check: Verify the session belongs to the logged-in user
    const session = await ChatSession.findOne({ _id: sessionId, userId: userId });
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized or session not found' }, { status: 403 });
    }

    // 4. Find all messages for the given session, sorted by creation date
    const messages = await Message.find({ sessionId }).sort({ createdAt: 'asc' });

    // 5. Return the messages
    return NextResponse.json(messages, { status: 200 });

  } catch (error) {
    console.error('Fetch messages error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { message: 'An error occurred while fetching messages.' },
      { status: 500 }
    );
  }
}
