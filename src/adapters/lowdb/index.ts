import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { Adapter } from '../../../typings';
import { generateHashId, getMeta } from '../../utils';

interface AdapterOptions {
  pageSize?: number;
}

export default async (
  adapterOptions: AdapterOptions = {}
): Promise<Adapter> => {
  const { pageSize = 50 } = adapterOptions;

  const adapter = new FileSync(
    process.env.NODE_ENV === 'test' ? 'db-test.json' : 'db.json'
  );
  const db = low(adapter);

  const getCollections = () => Promise.resolve(Object.keys(db.getState()));

  const getAll = (collection: string, options: any = {}) => {
    const { page = 1, baseUrl } = options;
    const results = (db.get(collection).value() as Array<any>) || [];
    const count = db.get(collection).size().value();
    return Promise.resolve({
      meta: getMeta(count, page, pageSize, baseUrl, collection),
      results,
    });
  };

  const get = (collection: string, id: string) =>
    Promise.resolve((db.get(collection) as any).find({ id }).value());

  const create = async (collection: string, { id: _id, ...data }: any) => {
    if (!db.get(collection).value()) {
      console.log(`${collection} collection`, db.get(collection).value());
      console.log('new set getState', db.getState());
      db.setState({ ...(db.getState() || {}), [collection]: [] });
      console.log('after getState', db.getState());
    }
    const id = generateHashId();
    const obj = {
      ...data,
      _id: id,
      id,
    };
    (db.get(collection) as any).push(obj).write();
    console.log('getState', db.getState());
    return Promise.resolve(obj);
  };

  const update = async (collection: string, id: string, data: any) => {
    (db.get(collection) as any).find({ id }).assign(data).write();
    console.log('getState', db.getState());
    return Promise.resolve((db.get(collection) as any).find({ id }).value());
  };

  const destroy = async (collection: string, id: string) => {
    console.log('getState', db.getState());
    (db.get(collection) as any).remove({ id }).write();
    return { n: 1, ok: 1 };
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
