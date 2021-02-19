import { Adapter } from '../typings';
import MongoDBAdapter from './adapters/mongodb';
import { logMsg } from './utils';
import api from './anyapi';

const PORT = 2000;
const BASE_URL = `http://localhost:${PORT}`;

MongoDBAdapter().then(({ adapter }) => {
  api(BASE_URL, adapter).listen(PORT);
  logMsg('anyapi listening on port ' + PORT);
});
