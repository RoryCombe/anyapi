// The main file of our api.
//
//-----------------------------------------------------------

var util = require("util"),
    MongoClient = require("mongodb").MongoClient,
    Server = require("mongodb").Server,
    restify = require("restify"),
    log = require("./logging");

var api = restify.createServer();
var mongoclient = new MongoClient(new Server("localhost", 27017));
var db = mongoclient.db("anyapi");

function getQueryOptions(req) {
    var options = {};    
    for (var q in req.query) {
        options[q] = req.query[q].indexOf(":") > -1 ? [req.query[q].split(":")] : req.query[q];
    }
    return options;
};

api.use(restify.acceptParser(api.acceptable));
api.use(restify.authorizationParser());
api.use(restify.dateParser());
api.use(restify.queryParser());
api.use(restify.bodyParser());
// api.use(function crossOrigin(req, res, next){
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	return next();
// });

// ###Handlers

// Get single
api.get("/:collection/:id", function(req, res, next){
    db.collection(req.params.collection).findOne({ "id" : req.params.id }, function(err, doc) {
        if(err) next(new restify.ResourceNotFoundError("Get single error"));
        res.send(doc);
    });
});

// Get multiple
api.get("/:collection", function(req, res, next){
    var options = getQueryOptions(req);
    db.collection(req.params.collection).find({}, options).toArray(function(err, doc){
        if(err) next(new restify.ResourceNotFoundError("Get multiple error"));
        log.out("Options: " + JSON.stringify(options));
        res.send(doc);
    });    
});

// Create
api.post("/:collection", function(req, res, next){
    db.collection(req.params.collection).insert(JSON.parse(req.body), { w:1 }, function(err, doc){
        if(err) next(new restify.ResourceNotFoundError("Create error"));
        res.send(doc);
    });    
});

// Update
api.put("/:collection/:id", function(req, res, next){
    db.collection(req.params.collection).update({ "id" : req.params.id }, { $set: JSON.parse(req.body) }, {}, function(err, doc) {
        if(err) next(new restify.ResourceNotFoundError("Update error"));
        db.collection(req.params.collection).findOne({ "id" : req.params.id }, function(err, doc) {
            if(err) next(new restify.ResourceNotFoundError("Get after update error"));
            res.send(doc);
        });
    });
});

// Delete
api.del("/:collection/:id", function(req, res, next){
    db.collection(req.params.collection).remove({ "id" : req.params.id }, { w:1 }, function(err, doc) {
        if(err) next(new restify.ResourceNotFoundError("Delete error"));
        res.send(200, "Document(s) affected " + doc);
    });    
});

// ###Start
mongoclient.open(function(err, mongoclient) {
    if(err) throw err;
    var port = 2000;
    try {
    	port = fs.readFileSync(__dirname + "/data/port", "UTF-8").replace(/\s+$/, "");
    } 
    catch (err) {
    	log.out("I see no data/port file, defaulting to port " + port);
    }

    api.listen(port);
    log.out("anyapi listening on port " + port);
});
