import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Create a response object to send back
    const response = NextResponse.json(
      { message: 'Logout successful.' },
      { status: 200 }
    );

    // Set the 'token' cookie with an expiration date in the past
    // This effectively deletes the cookie from the browser
    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0), // Set expiration to a past date
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'An error occurred during logout.' },
      { status: 500 }
    );
  }
}
