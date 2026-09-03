import mongoose from 'mongoose';

/**
 * Global cache for MongoDB connection to optimize for serverless and long-lived node servers,
 * avoiding multiple connections and handling reconnects gracefully.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    lastError: string | null;
    connectedUri: string | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null, lastError: null, connectedUri: null };
}

export function getMongoUri(): string | undefined {
  const raw =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL ||
    process.env.MONGODB_URL;

  if (!raw) return undefined;
  // Strip surrounding quotes and whitespace
  const cleaned = raw.trim().replace(/^["']|["']$/g, '');
  return cleaned.length > 0 ? cleaned : undefined;
}

export async function connectToDatabase(overrideUri?: string): Promise<{ isConnected: boolean; error?: string; source?: string }> {
  const uri = overrideUri || getMongoUri();

  if (!uri) {
    cached.lastError = 'MongoDB URI is not configured';
    return {
      isConnected: false,
      error: cached.lastError,
      source: 'local_database_file',
    };
  }

  // If already connected to this same URI
  if (mongoose.connection.readyState === 1 && cached.connectedUri === uri) {
    cached.conn = mongoose;
    cached.lastError = null;
    return { isConnected: true, source: 'mongodb' };
  }

  // If changing URI, disconnect old connection first
  if (overrideUri && cached.connectedUri && cached.connectedUri !== overrideUri) {
    try {
      await mongoose.disconnect();
    } catch {}
    cached.conn = null;
    cached.promise = null;
  }

  // If connection is in progress, wait for existing promise
  if (mongoose.connection.readyState === 2 && cached.promise) {
    try {
      cached.conn = await cached.promise;
      return { isConnected: true, source: 'mongodb' };
    } catch (e: any) {
      cached.promise = null;
      cached.lastError = e.message;
      return { isConnected: false, error: e.message, source: 'local_database_file' };
    }
  }

  // Reset cached promise if connection was lost or disconnected
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to prevent IPv6 DNS timeout in cloud sandboxes
      retryWrites: true,
      w: 'majority',
    };

    // If URI doesn't include database name, set dbName to jutu_store
    if (!uri.includes('mongodb.net/') || uri.match(/mongodb\.net\/\?/) || uri.match(/mongodb\.net\/$/)) {
      opts.dbName = 'jutu_store';
    }

    console.log('🔄 [MongoDB] Initiating connection to MongoDB Atlas...');
    cached.connectedUri = uri;

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        const host = m.connection.host || 'Atlas Cluster';
        const dbName = m.connection.name || 'jutu_store';
        console.log(`✅ [MongoDB Atlas] Successfully connected to database "${dbName}" on host [${host}]`);
        cached.lastError = null;
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        cached.lastError = err.message;
        console.error('❌ [MongoDB Atlas] Connection failed:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    cached.lastError = null;
    return { isConnected: true, source: 'mongodb' };
  } catch (e: any) {
    cached.promise = null;
    cached.conn = null;
    cached.lastError = e.message;
    return { isConnected: false, error: e.message, source: 'local_database_file' };
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function getDbConnectionDiagnostics() {
  const uri = getMongoUri();
  const readyState = mongoose.connection.readyState;
  
  let stateName = 'disconnected';
  if (readyState === 1) stateName = 'connected';
  else if (readyState === 2) stateName = 'connecting';
  else if (readyState === 3) stateName = 'disconnecting';

  return {
    isConnected: readyState === 1,
    readyState,
    stateName,
    hasUriConfigured: Boolean(uri),
    databaseName: readyState === 1 ? (mongoose.connection.name || 'jutu_store') : null,
    lastError: cached.lastError,
  };
}

