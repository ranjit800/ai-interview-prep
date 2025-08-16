// /app/api/auth/register/route.js

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // 1. Connect to the database
  await dbConnect();

  try {
    // 2. Get the user data from the request body
    const { name, email, password } = await request.json();

    // 3. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 400 } // Bad Request
      );
    }

    // 4. Hash the password for security
    // A salt round of 10 is a good standard
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create a new user document with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 6. Save the new user to the database
    await newUser.save();

    // 7. Return a success response
    return NextResponse.json(
      { message: 'User registered successfully.' },
      { status: 201 } // Created
    );
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration.', error: error.message },
      { status: 500 } // Internal Server Error
    );
  }
}
