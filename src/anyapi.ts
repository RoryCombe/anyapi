import * as restify from 'restify';
import * as restifyErrors from 'restify-errors';
import * as log from './logging';
import { Adapter } from './typings/index';
import MongoDBAdapter from './adapters/mongodb';
import { getQueryOptions } from './helpers';
import { logInfo } from './logging';

const api = restify.createServer();
const adapter: Adapter = new MongoDBAdapter();

api.use(restify.plugins.acceptParser(api.acceptable));
api.use(restify.plugins.authorizationParser());
api.use(restify.plugins.dateParser());
api.use(restify.plugins.queryParser());
api.use(restify.plugins.bodyParser());

// api.use(function crossOrigin(req, res, next){
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	return next();
// });

// ###Handlers

// Get multiple
api.get('/:collection', async (req, res, next) => {
  const options = getQueryOptions(req);
  try {
    const { collection } = req.params;
    logInfo(`GET ALL on ${collection}`);
    let doc;
    if (collection) {
      doc = await adapter.getAll(collection, options);
    }
    res.send(doc || []);
  } catch (err) {
    next(new restifyErrors.ResourceNotFoundError('Get multiple error'));
    log.logError(err);
    log.out('Options: ' + JSON.stringify(options));
  }
});

// Get single
api.get('/:collection/:id', async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    logInfo(`GET SINGLE on ${collection} with ID ${id}`);
    const doc = await adapter.get(collection, id);
    res.send(doc);
  } catch (err) {
    next(new restifyErrors.ResourceNotFoundError('Get single error'));
    log.logError(err);
  }
});

// Create
api.post('/:collection', async (req, res, next) => {
  try {
    const { collection } = req.params;
    logInfo(`CREATE on ${collection}`);
    const doc = await adapter.create(collection, req.body);
    res.send(doc);
  } catch (err) {
    next(new restifyErrors.ResourceNotFoundError('Create error'));
    log.logError(err);
  }
});

// Update
api.put('/:collection/:id', async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    logInfo(`PUT on ${collection} with ID ${id}`);
    const doc = await adapter.update(collection, id, req.body);
    res.send(doc);
  } catch (err) {
    next(new restifyErrors.ResourceNotFoundError('Update error'));
    log.logError(err);
  }
});

// Delete
api.del('/:collection/:id', async (req, res, next) => {
  try {
    const { collection, id } = req.params;
    logInfo(`DELETE on ${collection} with ID ${id}`);
    const doc = await adapter.destroy(collection, id);
    res.send(200, 'Document(s) affected ' + doc);
  } catch (err) {
    next(new restifyErrors.ResourceNotFoundError('Delete error'));
    log.logError(err);
  }
});

// ###Start
const port = 2000;
api.listen(port);
log.out('anyapi listening on port ' + port);
