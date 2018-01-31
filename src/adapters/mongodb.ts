import { Adapter } from '../typings/index';
import * as mongo from 'mongodb';
import { logInfo } from '../logging';
import * as HashID from '../hashid';
const { MongoClient } = mongo;

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
    return this.db
      .collection(collection)
      .find({}, options)
      .toArray();
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
