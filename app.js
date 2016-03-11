var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var middleware = require('./middleware');
var basic_auth = require('./basic-auth');
//var basic_auth = require('auth');

module.exports = function(stockRepository) {
  app.use(middleware.logRequest);
  app.use(bodyParser.json());

/*  app.use(basic_auth, function(req,res,next){
    console.log('basic_auth');
  });

*/

  app.use(basic_auth('username', 'password'));

  var routes = require('./routes')(stockRepository);

  var start = Date.now();
  app.use(function (req,res,next){
    res.on('finished',function(){
      var elapsed = Date.now() - start;
      console.log("Time: "+elapsed);
    })
    next();
  });

  app.get('/stock', routes.findAll);
  app.post('/stock', routes.stockUp);
  app.get('/stock/:isbn', routes.getCount);

//  app.use(crossapp.tracing);
  app.use(middleware.clientError);
  app.use(middleware.serverError);


  return app;
};