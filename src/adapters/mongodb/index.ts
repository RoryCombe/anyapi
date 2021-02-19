import { MongoClient, Db } from 'mongodb';
import { Adapter } from '../../../typings';
import { generateHashId, getMeta, logInfo } from '../../utils';

interface AdapterOptions {
  url?: string;
  dbName?: string;
  pageSize?: number;
}

export default (adapterOptions: AdapterOptions = {}): Adapter => {
  const {
    url = 'mongodb://localhost:27017',
    dbName = process.env.NODE_ENV === 'test' ? 'anyapi-test' : 'anyapi',
    pageSize = 50,
  } = adapterOptions;
  let db: Db;

  // Use connect method to connect to the server
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    logInfo(`DB ${dbName} connected`);
  });

  const getCollections = async () => {
    const collections = await db.collections();
    return collections.map((c) => c.collectionName);
  };

  const getAll = async (collection: string, options: any = {}) => {
    const { page = 1, baseUrl } = options;
    const [results, count] = await Promise.all([
      db.collection(collection).find({}, options).toArray(),
      db.collection(collection).count({}),
    ]);
    return {
      meta: getMeta(count, page, pageSize, baseUrl, collection),
      results,
    };
  };

  const get = (collection: string, id: string) =>
    db.collection(collection).findOne({ id });

  const create = (collection: string, { id: _id, ...data }: any) =>
    db
      .collection(collection)
      .insertOne({ id: generateHashId, ...data }, { w: 1 });

  const update = async (collection: string, id: string, data: any) => {
    await db.collection(collection).updateOne({ id }, { $set: data }, {});
    return db.collection(collection).findOne({ id });
  };

  const destroy = (collection: string, id: string) =>
    db.collection(collection).deleteOne({ id }, { w: 1 });

  return {
    getCollections,
    getAll,
    get,
    create,
    update,
    destroy,
  };
};

/*
export default class MongoDBAdapter implements Adapter {
  db: mongo.Db;

  constructor() {
    const url = 'mongodb://localhost:27017';
    const dbName = 'anyapi';
    // Use connect method to connect to the server
    MongoClient.connect(url, (err, client) => {
      if (err) throw err;
      this.db = client.db(dbName);
      logInfo(`DB ${dbName} connected`);
    });
  }

  getAll(collection: string, options: any = {}) {
    return this.db.collection(collection).find({}, options).toArray();
  }

  get(collection: string, id: string) {
    // return this.db.collection(collection).findOne({ _id: new mongo.ObjectId(id) });
    return this.db.collection(collection).findOne({ id });
  }

  create(collection: string, data: any) {
    const id = HashID.generate();
    delete data.id;
    return this.db.collection(collection).insert({ id, ...data }, { w: 1 });
  }

  async update(collection: string, id: string, data: any) {
    await this.db.collection(collection).update({ id }, { $set: data }, {});
    return this.db.collection(collection).findOne({ id });
  }

  destroy(collection: string, id: string) {
    return this.db.collection(collection).remove({ id }, { w: 1 });
  }
}
*/
