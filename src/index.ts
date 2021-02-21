#!/usr/bin/env node

import { MongoClient, MongoClientOptions } from 'mongodb';
import MongoDBAdapter from './adapters/mongodb';
import { logError, logMsg } from './utils';
import api from './anyapi';

const PORT = 2000;
const BASE_URL = `http://localhost:${PORT}`;

const run = async () => {
  try {
    const url = 'mongodb://localhost:27017';
    const dbName = 'anyapi';

    const connection = await MongoClient.connect(url, {
      useUnifiedTopology: true,
      writeConcern: {
        j: true,
      },
    } as MongoClientOptions);
    const db = connection.db(dbName);
    const adapter = await MongoDBAdapter(db, { pageSize: 50 });
    api(BASE_URL, adapter).listen(PORT);
    logMsg('anyapi listening on port ' + PORT);
  } catch (error) {
    logError(`An error occurred: ${JSON.stringify(error)}`);
  }
};

run();
