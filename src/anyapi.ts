import * as restify from 'restify';
import * as restifyErrors from 'restify-errors';
import { Adapter } from '../typings/index';
import { logInfo, logError } from './utils';

export default function (baseUrl: string, adapter: Adapter) {
  const api = restify.createServer();

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
    const options = { ...(req.query || {}), baseUrl };
    try {
      const { collection } = req.params;
      if (collection === 'favicon.ico') {
        res.send([]);
      } else {
        let doc;
        if (collection) {
          logInfo(`GET ALL on ${collection}`);
          doc = await adapter.getAll(collection, options);
        } else {
          logInfo('GET Collections');
          const collections = await adapter.getCollections();
          doc = collections.reduce((acc, val) => {
            acc[val] = `${baseUrl}/${val}`;
            return acc;
          }, {} as Record<string, string>);
        }
        res.send(doc || []);
      }
    } catch (err) {
      next(new restifyErrors.ResourceNotFoundError('Get multiple error'));
      logError(err);
      logInfo('Options: ' + JSON.stringify(options));
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
      logError(err);
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
      logError(err);
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
      logError(err);
    }
  });

  // Delete
  api.del('/:collection/:id', async (req, res, next) => {
    try {
      const { collection, id } = req.params;
      logInfo(`DELETE on ${collection} with ID ${id}`);
      const doc = await adapter.destroy(collection, id);
      res.send(doc);
    } catch (err) {
      next(new restifyErrors.ResourceNotFoundError('Delete error'));
      logError(err);
    }
  });

  return api;
}
