
var express = require('express')
  , http = require('http')
  , requirejs = require('requirejs')
  , mysql = require('mysql')
  , app = express();

// var connectionpool = mysql.createPool({
//   host : 'localhost',
//   user : 'root',
//   password : '123',
//   database : 'todo-app'
// });

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.static(__dirname));
  app.use(express.query());
  app.use(express.bodyParser());
  app.use(app.router);
});

requirejs.config({
  baseUrl : __dirname,
  nodeRequire : require
});


// app.get('/', function(req, res) {
//   res.send('hello world')
// });
// app.get('/', function(req, res) {});
// app.put('/', function(req, res) {});
// app.post('/', function(req, res) {});
// app.delete('/', function(req, res) {});

app.post('/oauth2/token', function(req, res) {
  var username = req.param('username');
  var password = req.param('password');
  res.json({
    token : 'jnkjhuihu'
  })
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server started on port: ' + app.get('port'));
});
