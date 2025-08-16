// // /api/chat/route.js

// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import ChatSession from '@/models/ChatSession';
// import Message from '@/models/Message';
// import { GoogleGenerativeAI, GoogleGenerativeAIError } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const token = request.cookies.get('token')?.value;
//     if (!token) {
//       return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     let { sessionId, message, isQuiz } = await request.json(); // ** isQuiz ko yahan receive karein **
//     let isNewChat = false;
//     let newTopic = null;

//     if (!sessionId) {
//       isNewChat = true;
//       const newSession = new ChatSession({ userId });
//       await newSession.save();
//       sessionId = newSession._id;
//     }

//     const userMessage = new Message({
//       sessionId,
//       role: 'user',
//       content: message,
//     });
//     await userMessage.save();

//     const conversationHistory = await Message.find({ sessionId }).sort({ createdAt: 'asc' });
    
//     const historyForAI = conversationHistory.map(msg => ({
//         role: msg.role === 'assistant' ? 'model' : 'user',
//         parts: [{ text: msg.content }],
//     })).slice(0, -1);

//     // ** THE CHANGE IS HERE: Quiz ke liye JSON mode enable karein **
//     const modelConfig = {
//         model: "gemini-1.5-flash",
//         ...(isQuiz && { // Agar isQuiz true hai, toh JSON mode on karein
//             generationConfig: {
//                 responseMimeType: "application/json",
//             }
//         })
//     };
//     const model = genAI.getGenerativeModel(modelConfig);

//     const chat = model.startChat({
//         history: historyForAI,
//         generationConfig: { maxOutputTokens: 2048 }, // Thoda token badhayein
//     });
//     const result = await chat.sendMessage(message);
//     const aiResponse = await result.response;
//     const aiResponseText = aiResponse.text();

//     const assistantMessage = new Message({
//         sessionId,
//         role: 'assistant',
//         content: aiResponseText,
//         // ** contentType ko set karein **
//         contentType: isQuiz ? 'quiz_json' : 'text',
//     });
//     await assistantMessage.save();

//     if (isNewChat) {
//       const topicPrompt = `Based on the following first message of a conversation, create a very short, concise topic title (3-5 words max). Message: "${message}" \n Topic Title:`;
//       const topicModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       const topicResult = await topicModel.generateContent(topicPrompt);
//       const topicResponse = await topicResult.response;
//       newTopic = topicResponse.text().trim().replace(/"/g, '');
//       await ChatSession.findByIdAndUpdate(sessionId, { topic: newTopic });
//     }

//     return NextResponse.json(
//       { 
//         response: assistantMessage, 
//         sessionId: sessionId,
//         newTopic: newTopic
//       }, 
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('Chat API error:', error);
//     if (error instanceof GoogleGenerativeAIError) {
//         return NextResponse.json({ message: 'Google AI server is currently busy. Please try again in a moment.' }, { status: 503 });
//     }
//     if (error.name === 'JsonWebTokenError') {
//       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//     }
//     return NextResponse.json({ message: 'An error occurred in the chat API.', error: error.message }, { status: 500 });
//   }
// }



// /api/chat/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import ChatSession from '@/models/ChatSession';
import Message from '@/models/Message';
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

    let { sessionId, message, isQuiz } = await request.json();
    let isNewChat = false;
    let newTopic = null;

    if (!sessionId) {
      isNewChat = true;
      const newSession = new ChatSession({ userId });
      await newSession.save();
      sessionId = newSession._id;
    }

    const userMessage = new Message({
      sessionId,
      role: 'user',
      content: message,
    });
    await userMessage.save();

    const conversationHistory = await Message.find({ sessionId }).sort({ createdAt: 'asc' });
    
    const historyForAI = conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    })).slice(0, -1);

    const modelConfig = {
        model: "gemini-1.5-flash",
        ...(isQuiz && {
            generationConfig: {
                responseMimeType: "application/json",
            }
        })
    };
    const model = genAI.getGenerativeModel(modelConfig);

    const chat = model.startChat({
        history: historyForAI,
        generationConfig: { maxOutputTokens: 2048 },
    });
    const result = await chat.sendMessage(message);
    const aiResponse = await result.response;
    const aiResponseText = aiResponse.text();

    const assistantMessage = new Message({
        sessionId,
        role: 'assistant',
        content: aiResponseText,
        contentType: isQuiz ? 'quiz_json' : 'text',
    });
    await assistantMessage.save();

    if (isNewChat) {
      const topicPrompt = `Based on the following first message of a conversation, create a very short, concise topic title (3-5 words max). Message: "${message}" \n Topic Title:`;
      const topicModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const topicResult = await topicModel.generateContent(topicPrompt);
      const topicResponse = await topicResult.response;
      newTopic = topicResponse.text().trim().replace(/"/g, '');
      await ChatSession.findByIdAndUpdate(sessionId, { topic: newTopic });
    }

    return NextResponse.json(
      { 
        response: assistantMessage, 
        sessionId: sessionId,
        newTopic: newTopic
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Chat API error:', error);
    if (error instanceof GoogleGenerativeAIError) {
        return NextResponse.json({ message: 'Google AI server is currently busy. Please try again in a moment.' }, { status: 503 });
    }
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'An error occurred in the chat API.', error: error.message }, { status: 500 });
  }
}
