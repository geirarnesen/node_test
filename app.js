var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var middleware = require('./middleware');

module.exports = function(stockRepository) {
  app.use(middleware.logRequest);
  app.use(bodyParser.json());

  var routes = require('./routes')(stockRepository);

  app.get('/stock', routes.findAll);
  app.post('/stock', routes.stockUp);
  app.get('/stock/:isbn', routes.getCount);

  app.use(middleware.clientError);
  app.use(middleware.serverError);

  return app;
};