//var http = require('http')
//console.log("hello world");
//var server = http.createServer(function(req,res){
//  res.end('hello world');
//});
//
//server.listen(3000, function () {
//  console.log("When this.....: " + 3000);
//});
var stockRepository = require('./stockRepository')();
var app = require('./app')(stockRepository);

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});