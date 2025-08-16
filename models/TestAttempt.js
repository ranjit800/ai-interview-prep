// /models/TestAttempt.js
import mongoose from 'mongoose';

const TestAttemptSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // We store the user's answers to review later
  answers: [{
    questionText: String, // Store the question text for easy review
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
  }],
  score: {
    type: Number, // e.g., 20 out of 25 correct
    required: true,
  },
  pointsAwarded: {
    type: Number, // e.g., 80 points awarded for the score
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress'],
    default: 'in-progress',
  },
  completedAt: {
    type: Date,
  },
}, { 
  timestamps: true 
});

export default mongoose.models.TestAttempt || mongoose.model('TestAttempt', TestAttemptSchema);
