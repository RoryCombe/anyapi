import { Db } from 'mongodb';
import { Adapter } from '../../../typings';
import { generateHashId, getMeta } from '../../utils';

interface AdapterOptions {
  pageSize?: number;
}

export default async (
  db: Db,
  adapterOptions: AdapterOptions = {}
): Promise<Adapter> => {
  const { pageSize = 50 } = adapterOptions;

  const dbCollection = (collection: string) =>
    db.collection(collection, {
      writeConcern: { w: null },
    } as any);

  const getCollections = async () => {
    const collections = await db.collections();
    return collections.map((c) => c.collectionName);
  };

  const getAll = async (collection: string, options: any = {}) => {
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
    getCollections,
    getAll,
    get,
    create,
    update,
    destroy,
  };
};
