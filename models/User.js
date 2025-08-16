// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true, // Each email must be unique in the database
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 6, // Enforce a minimum password length
  },
  points: {
    type: Number,
    default: 0, // Users start with 0 points
  },
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// This line prevents Mongoose from redefining the model every time in a serverless environment
export default mongoose.models.User || mongoose.model('User', UserSchema);
