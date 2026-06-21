import mongoose from "mongoose";

const { DATABASE_URL, DB_NAME } = process.env;

type CachedMongo = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: CachedMongo | undefined;
}

const cached = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from the environment.");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(DATABASE_URL, {
      dbName: DB_NAME || undefined,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
