#!/usr/bin/env node

import { MongoClient, MongoClientOptions } from 'mongodb';
import MongoDBAdapter from './adapters/mongodb';
import LowDBAdapter from './adapters/lowdb';
import { logError, logMsg, logHeader } from './utils';
import api from './anyapi';
import clear from 'clear';

const argv = require('minimist')(process.argv.slice(2));

const PORT = argv.port || 2000;
const BASE_URL = `http://localhost:${PORT}`;
const pageSize = argv['page-size'] || 50;
const mongoDbUrl = argv['mongo-db-url'] || 'mongodb://localhost:27017';

const startLowDB = () => {
  logMsg('Starting lowDB adapter');
  return LowDBAdapter({ pageSize });
};

const startMongo = async () => {
  try {
    logMsg('Starting Mongo DB adapter');
    const dbName = 'anyapi';
    const connection = await MongoClient.connect(mongoDbUrl, {
      useUnifiedTopology: true,
      writeConcern: {
        j: true,
      },
    } as MongoClientOptions);
    const db = connection.db(dbName);
    return MongoDBAdapter(db, { pageSize });
  } catch (error) {
    logError(
      'An error occurred connecting to Mongo DB. Please ensure that the Mongo DB process is started and running.'
    );
  }
};

const run = async () => {
  try {
    clear();
    logHeader('any api');

    const startFn = argv.mongo ? startMongo : startLowDB;
    const adapter = await startFn();
    if (adapter) {
      api(BASE_URL, adapter).listen(PORT);
      logMsg('anyapi listening on port ' + PORT);
    }
  } catch (error) {
    logError(`An error occurred: ${JSON.stringify(error)}`);
  }
};

run();
