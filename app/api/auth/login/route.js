// /api/auth/login/route.js

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    const user = await User.findOne({ email }).select('-password'); // Exclude password from the start
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // We need the full user object with password to compare
    const userWithPassword = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, userWithPassword.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const tokenPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const response = NextResponse.json(
      { 
        message: 'Login successful.',
        user: user // **THE CHANGE: Return the user object in the response**
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
}
