// lib/dbConnect.js
import mongoose from 'mongoose';

/** * This is a cache for the database connection.
 * In a serverless environment, functions can be invoked multiple times, 
 * and we don't want to create a new database connection on every invocation.
 * By caching the connection, we can reuse it across multiple function calls.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // If we have a cached connection, return it
    return cached.conn;
  }

  if (!cached.promise) {
    // If there's no promise of a connection, create one
    const opts = {
      bufferCommands: false,
    };

    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully.");
      return mongoose;
    });
  }
  
  try {
    // Await the promise to resolve, which gives us the connection
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
