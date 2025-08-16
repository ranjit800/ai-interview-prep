// /app/api/auth/me/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request) {
  try {
    // 1. Get the token from the request cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated. No token provided.' },
        { status: 401 }
      );
    }

    // 2. Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user in the database based on the ID from the token
    await dbConnect();
    const user = await User.findById(decoded.id).select('-password'); // .select('-password') excludes the password field

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    // 4. Return the user data
    return NextResponse.json(
      { user },
      { status: 200 }
    );

  } catch (error) {
    // This will catch errors like an invalid or expired token
    return NextResponse.json(
      { message: 'Not authenticated. Invalid token.', error: error.message },
      { status: 401 }
    );
  }
}
