import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setDbMode } from './dbMode.js';
import { initOfflineStore } from './offlineStore.js';

let memoryServer;

export async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nimbus';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    setDbMode('persistent');
    console.log('MongoDB connected');
    return { mode: 'persistent', uri };
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }

    console.warn(`MongoDB unavailable (${err.message}). Using in-memory database for development.`);

    try {
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri('nimbus');
      await mongoose.connect(memoryUri);
      setDbMode('memory');
      console.log('In-memory MongoDB connected');
      return { mode: 'memory', uri: memoryUri };
    } catch (memErr) {
      console.warn(`In-memory MongoDB unavailable (${memErr.message}). Using offline dev store.`);
      initOfflineStore();
      setDbMode('offline');
      return { mode: 'offline' };
    }
  }
}
