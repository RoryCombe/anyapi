import { MongoClient, Db, MongoClientOptions } from 'mongodb';
import { Adapter } from '../../../typings';
import { generateHashId, getMeta, logInfo } from '../../utils';

interface AdapterOptions {
  url?: string;
  dbName?: string;
  pageSize?: number;
  dropDatabase?: boolean;
}

export default async (
  adapterOptions: AdapterOptions = {}
): Promise<{ adapter: Adapter; client: MongoClient }> => {
  const {
    url = 'mongodb://localhost:27017',
    dbName = 'anyapi',
    pageSize = 50,
    dropDatabase,
  } = adapterOptions;
  let db: Db;

  // Use connect method to connect to the server
  const client = await MongoClient.connect(url, {
    useUnifiedTopology: true,
    writeConcern: {
      j: true,
    },
  } as MongoClientOptions);

  if (dropDatabase) {
    await client.db(dbName).dropDatabase();
  }

  db = client.db(dbName);

  const dbCollection = (collection: string) =>
    db.collection(collection, {
      writeConcern: { w: null },
    } as any);

  logInfo(`DB ${dbName} connected`);

  const getCollections = async () => {
    logInfo(`db ${JSON.stringify(db.databaseName)}`);
    const collections = await db.collections();
    return collections.map((c) => c.collectionName);
  };

  const getAll = async (collection: string, options: any = {}) => {
    logInfo(`db ${JSON.stringify(db.databaseName)}`);
    const { page = 1, baseUrl } = options;
    const [results, count] = await Promise.all([
      dbCollection(collection).find({}, options).toArray(),
      (dbCollection(collection) as any).estimatedDocumentCount(),
    ]);
    return {
      meta: getMeta(count, page, pageSize, baseUrl, collection),
      results,
    };
  };

  const get = (collection: string, id: string) =>
    dbCollection(collection).findOne({ id });

  const create = async (collection: string, { id: _id, ...data }: any) => {
    const result = await dbCollection(collection).insertOne({
      id: generateHashId(),
      ...data,
    });
    return result.ops[0];
  };

  const update = async (collection: string, id: string, data: any) => {
    await dbCollection(collection).updateOne({ id }, { $set: data }, {});
    return dbCollection(collection).findOne({ id });
  };

  const destroy = async (collection: string, id: string) => {
    const result = await dbCollection(collection).deleteOne({ id });
    return result.result;
  };

  return {
    adapter: {
      getCollections,
      getAll,
      get,
      create,
      update,
      destroy,
    },
    client,
  };
};
