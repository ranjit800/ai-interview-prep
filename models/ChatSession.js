// /models/ChatSession.js
import mongoose from 'mongoose';

const ChatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    default: 'New Chat',
  },
  // ** NAYA FIELD ADD KIYA GAYA **
  pinned: {
    type: Boolean,
    default: false, // Default mein koi bhi chat pinned nahi hoga
  },
}, { 
  timestamps: true
});

export default mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);
