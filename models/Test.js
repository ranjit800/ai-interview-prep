// /models/Test.js
import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  // An array to hold all the questions for the test
  questions: [{
    questionText: {
      type: String,
      required: true,
    },
    // An array of strings for the 4 options
    options: {
        type: [String],
        required: true,
        validate: [arr => arr.length === 4, 'Must have exactly 4 options']
    },
    correctAnswer: {
      type: String,
      required: true,
    },
  }],
  // We can define how many points this test is worth
  totalPoints: {
    type: Number,
    default: 100, // Example: Test is worth 100 points
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { 
  timestamps: true 
});

export default mongoose.models.Test || mongoose.model('Test', TestSchema);
