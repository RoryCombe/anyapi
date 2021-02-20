import supertest, { SuperTest } from 'supertest';
import { Adapter } from '../typings';
import api from './anyapi';
import MongoDBAdapter from './adapters/mongodb';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

let request: SuperTest<any>;
let connection: MongoClient;
let db: Db;

beforeAll(async () => {
  connection = await MongoClient.connect((global as any).__MONGO_URI__, {
    useNewUrlParser: true,
  } as MongoClientOptions);
  db = connection.db((global as any).__MONGO_DB_NAME__);

  const PORT = 2000;
  const BASE_URL = `http://localhost:${PORT}`;
  const adapter = await MongoDBAdapter(db, {
    pageSize: 50,
  });
  request = supertest(api(BASE_URL, adapter));
});

afterAll(async () => {
  await connection.close();
});

// beforeAll((done) => {
//   MongoDBAdapter({
//     url: (global as any).__MONGO_URI__, // 'mongodb://localhost:27017',
//     dbName: 'anyapi-test',
//     pageSize: 50,
//     dropDatabase: true,
//   }).then(({ adapter, client }) => {
//     request = supertest(api(BASE_URL, adapter));
//     mongoClient = client;
//     done();
//   });
// });

// afterAll(() => {
//   mongoClient.close();
// });

describe('any api', () => {
  test('GET ALL COLLECTIONS - lists all collections', async () => {
    const { body } = await request.get('/');
    expect(body).toEqual({});
  });

  test('GET ALL ON COLLECTION - lists all objects in a collection', async () => {
    const { body } = await request.get('/SomeCollection');
    expect(body).toEqual({
      meta: {
        count: 0,
        pages: 0,
        next: null,
        prev: null,
      },
      results: [],
    });
  });

  test('POST ON COLLECTION - creates a new object in a collection', async () => {
    const post = await request
      .post('/SomeCollection')
      .send({ name: 'John', age: 33, hobbies: ['football', 'poetry'] });
    expect(post.body._id).toBeTruthy();
    expect(post.body.id).toBeTruthy();
    expect(post.body.name).toEqual('John');
    expect(post.body.age).toEqual(33);
    expect(post.body.hobbies.length).toEqual(2);
  });

  test('PUT ON COLLECTION - updates an existing object in a collection', async () => {
    const post = await request.post('/SomeCollection').send({
      name: 'Sarah',
      age: 25,
      hobbies: ['fencing', 'reading', 'programming'],
    });
    expect(post.body._id).toBeTruthy();
    expect(post.body.id).toBeTruthy();
    expect(post.body.name).toEqual('Sarah');
    expect(post.body.age).toEqual(25);
    expect(post.body.hobbies.length).toEqual(3);

    const put = await request
      .put(`/SomeCollection/${post.body.id}`)
      .send({ name: 'Sarah', age: 22, hobbies: ['reading', 'programming'] });
    expect(put.body.name).toEqual('Sarah');
    expect(put.body.age).toEqual(22);
    expect(put.body.hobbies.length).toEqual(2);
  });

  test('DELETE ON COLLECTION - deletes an existing object from a collection', async () => {
    const post = await request.post('/SomeCollection').send({
      name: 'Bob',
      age: 52,
      hobbies: ['walks', 'sleeping'],
    });
    expect(post.body._id).toBeTruthy();
    expect(post.body.id).toBeTruthy();
    expect(post.body.name).toEqual('Bob');
    expect(post.body.age).toEqual(52);
    expect(post.body.hobbies.length).toEqual(2);

    const destroy = await request.delete(`/SomeCollection/${post.body.id}`);
    expect(destroy.body).toEqual({ n: 1, ok: 1 });
  });

  test('Full loop - create, update, delete objects in a collection', async () => {
    const post = await request
      .post('/humans')
      .send({ name: 'john', age: 33, hobbies: ['football', 'poetry'] });
    expect(post.body._id).toBeTruthy();
    expect(post.body.name).toEqual('john');
    expect(post.body.age).toEqual(33);
    expect(post.body.hobbies.length).toEqual(2);

    const getAll = await request.get('/humans');
    expect(getAll.body).toEqual({
      meta: {
        count: 1,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [post.body],
    });
  });
});
