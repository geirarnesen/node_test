var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mongo_books_oslo_1';

function stockRepo(){
  return {
    stockUp: function(){} ,
    findAll: function(){},
  };
};

var collectionPromise = MongoClient.connect(url).then(function (db) {
  return db.collection('book');
})

function logRequest(req, res, next) {
  console.log('Incoming request at ' + new Date());
  next();
}

function clientError(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}
function serverError(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);
  res.json({message: err.message, error: (process.env.NODE_ENV === 'production') ? {} : err.stack});
}

app.use(logRequest);
app.use(bodyParser.json());

app.get('/', logRequest, function (req, res) {
  res.send('Hello World!');
});

app.get('/stock', function (req, res, next) {
  collectionPromise.then(function (collection) {
    return collection.find({}).toArray();
  }).then(function (books) {
    res.json(books);
  }).catch(next);
  //collection.find({}).toArray(function (err, docs) {
  //    res.json(docs);
  //});
});

app.post('/stock', function (req, res, next) {
  var isbn = req.body.isbn;
  var count = req.body.count;

  collectionPromise.then(function (collection) {
    return collection.updateOne({isbn: isbn}, {
      isbn: isbn,
      count: count
    }, {upsert: true});
  }).then(function (result) {
    res.json({isbn: req.body.isbn, count: req.body.count});
  }).catch(next);
});


app.use(clientError);
app.use(serverError);

module.exports = app;