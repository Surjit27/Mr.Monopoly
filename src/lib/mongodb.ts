import { MongoClient, ServerApiVersion } from 'mongodb';

let client: MongoClient | null = null;

export const connectToMongoDB = async (uri: string) => {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  if (!client.connect) {
    throw new Error('MongoDB client not initialized');
  }

  await client.connect();
  return client;
};

export const syncDataToMongoDB = async (
  uri: string,
  collectionName: string,
  data: any,
  identifier: string
) => {
  try {
    const client = await connectToMongoDB(uri);
    const database = client.db('business_game');
    const collection = database.collection(collectionName);

    // Upsert the data - update if exists, insert if not
    await collection.updateOne(
      { identifier },
      { $set: { ...data, updatedAt: new Date() } },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error('MongoDB sync error:', error);
    return { success: false, error };
  }
};

export const getDataFromMongoDB = async (
  uri: string,
  collectionName: string,
  identifier: string
) => {
  try {
    const client = await connectToMongoDB(uri);
    const database = client.db('business_game');
    const collection = database.collection(collectionName);

    const data = await collection.findOne({ identifier });
    return { success: true, data };
  } catch (error) {
    console.error('MongoDB fetch error:', error);
    return { success: false, error };
  }
};