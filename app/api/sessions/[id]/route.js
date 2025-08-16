// /app/api/sessions/[id]/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import ChatSession from '@/models/ChatSession';
import Message from '@/models/Message';

// Yeh function ab topic rename aur pin/unpin, dono kaam karega
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { id: sessionId } = params;
    const { topic, pinned } = await request.json(); // topic ya pinned, koi bhi aa sakta hai

    let updateData = {};
    if (topic) {
      if (topic.trim() === '') return NextResponse.json({ message: 'Topic cannot be empty' }, { status: 400 });
      updateData.topic = topic;
    }
    if (typeof pinned === 'boolean') {
      updateData.pinned = pinned;
    }

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: 'No update data provided' }, { status: 400 });
    }

    const updatedSession = await ChatSession.findOneAndUpdate(
      { _id: sessionId, userId: userId },
      { $set: updateData }, // $set ka use karein
      { new: true }
    );

    if (!updatedSession) {
      return NextResponse.json({ message: 'Session not found or user not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Session updated successfully', session: updatedSession }, { status: 200 });

  } catch (error) {
    console.error('Update session error:', error);
    return NextResponse.json({ message: 'An error occurred while updating the session.'}, { status: 500 });
  }
}

// Yeh function session aur uske saare messages ko delete karega
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { id: sessionId } = params;

    const sessionToDelete = await ChatSession.findOne({ _id: sessionId, userId: userId });
    if (!sessionToDelete) {
      return NextResponse.json({ message: 'Session not found or user not authorized' }, { status: 404 });
    }

    await Message.deleteMany({ sessionId: sessionId });
    await ChatSession.findByIdAndDelete(sessionId);

    return NextResponse.json({ message: 'Session and messages deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json({ message: 'An error occurred while deleting the session.' }, { status: 500 });
  }
}
