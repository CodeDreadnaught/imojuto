import mongoose from "mongoose";
import { requireEnv } from "@/lib/env";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = globalThis.mongooseCache ?? { conn: null, promise: null };

globalThis.mongooseCache = cached;

export async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(String(requireEnv("MONGODB_URI")), {
      bufferCommands: false,
      dbName: "imojuto",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
