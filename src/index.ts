#!/usr/bin/env node

import { MongoClient, MongoClientOptions } from 'mongodb';
import MongoDBAdapter from './adapters/mongodb';
import LowDBAdapter from './adapters/lowdb';
import { logError, logMsg } from './utils';
import api from './anyapi';

const PORT = 2000;
const BASE_URL = `http://localhost:${PORT}`;
const pageSize = 50;

const startLowDB = () => LowDBAdapter({ pageSize });

const startMongo = async () => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'anyapi';
  const connection = await MongoClient.connect(url, {
    useUnifiedTopology: true,
    writeConcern: {
      j: true,
    },
  } as MongoClientOptions);
  const db = connection.db(dbName);
  return MongoDBAdapter(db, { pageSize });
};

const run = async () => {
  try {
    const adapter = await startLowDB();
    // const adapter = await startMongo();
    api(BASE_URL, adapter).listen(PORT);
    logMsg('anyapi listening on port ' + PORT);
  } catch (error) {
    logError(`An error occurred: ${JSON.stringify(error)}`);
  }
};

run();
