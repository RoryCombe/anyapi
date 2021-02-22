import fs from 'fs';
import supertest, { SuperTest } from 'supertest';
import api from './anyapi';
import LowDBAdapter from './adapters/lowdb';
import MongoDBAdapter from './adapters/mongodb';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

let request: SuperTest<any>;
let connection: MongoClient;
let db: Db;

const testGetAllCollections = async () => {
  const { body } = await request.get('/');
  expect(body).toEqual({});
};

const testGetAllOnSingleCollection = async () => {
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
};

const testPostOnCollection = async () => {
  const post = await request
    .post('/SomeCollection')
    .send({ name: 'John', age: 33, hobbies: ['football', 'poetry'] });
  expect(post.body._id).toBeTruthy();
  expect(post.body.id).toBeTruthy();
  expect(post.body.name).toEqual('John');
  expect(post.body.age).toEqual(33);
  expect(post.body.hobbies.length).toEqual(2);
};

const testPutOnCollection = async () => {
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
};

const testDeleteOnCollection = async () => {
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
};

const testFullLoop = async () => {
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
};

describe('Any API', () => {
  describe('lowdb adapter', () => {
    beforeAll(async () => {
      try {
        fs.unlinkSync('db-test.json');
      } catch (error) {}
      const PORT = 2000;
      const BASE_URL = `http://localhost:${PORT}`;
      const adapter = await LowDBAdapter({
        pageSize: 50,
      });
      request = supertest(api(BASE_URL, adapter));
    });

    afterAll(async () => {
      await connection.close();
    });

    test('GET ALL COLLECTIONS - lists all collections', testGetAllCollections);

    test(
      'GET ALL ON COLLECTION - lists all objects in a collection',
      testGetAllOnSingleCollection
    );

    test(
      'POST ON COLLECTION - creates a new object in a collection',
      testPostOnCollection
    );

    test(
      'PUT ON COLLECTION - updates an existing object in a collection',
      testPutOnCollection
    );

    test(
      'DELETE ON COLLECTION - deletes an existing object from a collection',
      testDeleteOnCollection
    );

    test(
      'Full loop - create, update, delete objects in a collection',
      testFullLoop
    );
  });

  describe('mongo adapter', () => {
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

    test('GET ALL COLLECTIONS - lists all collections', testGetAllCollections);

    test(
      'GET ALL ON COLLECTION - lists all objects in a collection',
      testGetAllOnSingleCollection
    );

    test(
      'POST ON COLLECTION - creates a new object in a collection',
      testPostOnCollection
    );

    test(
      'PUT ON COLLECTION - updates an existing object in a collection',
      testPutOnCollection
    );

    test(
      'DELETE ON COLLECTION - deletes an existing object from a collection',
      testDeleteOnCollection
    );

    test(
      'Full loop - create, update, delete objects in a collection',
      testFullLoop
    );
  });
});
