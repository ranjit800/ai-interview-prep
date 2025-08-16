// /models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession', // Creates a reference to the ChatSession model
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'], // The message can only be from a 'user' or 'assistant'
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    enum: ['text', 'quiz_json', 'research_markdown', 'test_link'],
    default: 'text',
  },
}, { 
  timestamps: true 
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
