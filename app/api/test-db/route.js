// /app/api/test-db/route.js

import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    // If dbConnect() does not throw an error, the connection is successful.
    return NextResponse.json(
      { message: "Successfully connected to MongoDB Atlas!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);
    // If there's an error, return an error response.
    return NextResponse.json(
      { error: "Failed to connect to MongoDB Atlas.", details: error.message },
      { status: 500 }
    );
  }
}
