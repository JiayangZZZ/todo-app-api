
GLOBAL.sql = require('sql');
sql.setDialect('mysql');

var express = require('express')
  , http = require('http')
  , requirejs = require('requirejs')
  , app = express()
  , mysql = require('mysql')
  , secret = 'kwefuiwurh'
  , User = require('./user')
  , Todo = require('./todo')
  , Todos = require('./todos');


GLOBAL.db = mysql.createConnection({
  host : 'mysql.zhangjiayang.dev.p1staff.com',
  user : 'root',
  password : 'yayp1dbroot',
  database : 'todo-app'
});

// connection.config.queryFormat = function(query, values) {
//   if (!values) return query;

//   console.log(query.replace(/\$(\d+)/g, function(match, key) {
//     key = key - 1;
//     if (key < values.length) {
//       return this.escape(values[key]);
//     }
//     return match;
//   }.bind(this)))

//   return query.replace(/\$(\d+)/g, function(match, key) {
//     key = key - 1;
//     if (key < values.length) {
//       return this.escape(values[key]);
//     }
//     return match;
//   }.bind(this));
// };

GLOBAL.userTable = sql.define({
  name: 'users',
  columns: ['id', 'username', 'password', 'created_time']
});

GLOBAL.clientTable = sql.define({
  name: 'clients',
  columns: ['client_id','client_secret']
});

GLOBAL.tokenTable = sql.define({
  name: 'tokens',
  columns: ['user_id', 'client_id', 'access_token', 'refresh_token', 'expires']
});

db.connect();

// user.putName('Oskar');

function isEmpty(obj) {
  if(typeof obj === 'undefined') {
    return true;
  }
  if(obj === null) {
    return true;
  }
  if(typeof obj === '') {
    return true;
  }
  return false;
}

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.static(__dirname));
  app.use(express.query());
  app.use(express.bodyParser());
  app.use(app.router);
});

app.post('/oauth2/token', function(req, res) {
  var username = req.body.username
    , password = req.body.password
    , clientId = req.body.client_id
    , clientSecret = req.body.client_secret;

  if(isEmpty(username)
  || isEmpty(password)
  || isEmpty(clientId)
  || isEmpty(clientSecret)) {
    return res.json(400, { error : 'invalid_request'})
  }

  var q = userTable
    .select('*')
    .from(userTable)
    .where(
      userTable.username.equals(req.body.username)
    ).and(
      userTable.password.equals(req.body.password)
    ).toQuery();

  var q2 = clientTable
    .select('*')
    .from(clientTable)
    .where(
      clientTable.client_id.equals(req.body.client_id)
    ).and(
      clientTable.client_secret.equals(req.body.client_secret)
    ).toQuery();


  function callback(err, clients, users) {
   // console.log(err,clients,users);
    if(!err) {
      if(clients.length === 0) {
        return res.json(401, { error : 'invalid_client' });
      }
      if(users.length === 0) {
        return res.json(401, { error : 'access_denied' });
      }

      else {
        var user = new User(username, password, clientId);
        var token = user.updateToken(function(err, tokens) {
          if(!err) {
            res.json(tokens);
          }
          else {
            throw err;
          }
        });
      }
    }
  };

  var n = 0;
  var _err, clients, users;

  db.query(q2.text, q2.values, function(err, result) {
    n++;
    clients = result;
    if(err && typeof _err === 'undefined') {
      _err = err;
    }
    if(n === 2) {
      callback(_err, clients, users);
    }
  });


  db.query(q.text, q.values, function(err, result) {
    n++;
    users = result;
    if(err && typeof _err === 'undefined') {
      _err = err;
    }
    if(n === 2) {
      callback(_err, clients, users);
    }
  });
});

function authenticate(req, res, next) {
  var q = tokenTable
    .select('*')
    .from(tokenTable)
    .where(tokenTable.access_token.equals(req.param('accessToken')))
    .toQuery();

  db.query(q.text, q.values, function(err, result) {
    if(!err) {
      if(result.length === 0) {
        return res.json(401, {error : 'access_denied'});
       }
      else {
        next();
      }
    }
  });
}

app.post('/todos', authenticate, function(req, res) {
  var todo = new Todo({
    userId : req.param('userId'),
    title : req.param('title'),
    description : req.param('description'),
    accessToken : req.param('accessToken')
  });

  console.log(todo);
  //res.send('lkwfefn')

  // todo.create(function(err) {
  //   if(!err) {
  //     res.json(todo)
  //   }
  //   else {
  //     return res.json(500, {error : 'Internal Server Error'});
  //   }
  // });

  todo.create(function(err, todo) {
    if(!err) {
      return res.json(todo);
    }
    throw err;
    res.json(500, { error : 'jhvhgh'});
  })
});

app.del('/todos/:id', authenticate, function(req, res) {
  var todo = new Todo({
    id : req.param('id')
  });
  todo.delete(function(err) {
    if(!err) {
      res.send();
    }
    else {
      return res.json(500, {error : 'Internal Server Error'});
    }
  })
});

app.put('/todos/:id', authenticate, function(req, res) {
  var todo = new Todo({
    id : req.param('id'),
    title : req.param('title'),
    description : req.param('description'),
    status : req.param('status')
  });
  todo.update(function(err) {
    if(!err) {
      res.json(todo);
    }
    else {
      return res.json(500, {error : 'Internal Server Error'});
    }
  })
});

app.get('/todos/:id', authenticate, function(req, res) {
  var todo = new Todo({
    id : req.param('id')
  });
  todo.read(function(err, oneTodo) {
    if(!err) {
      res.json(oneTodo)
    }
    else {
      return res.json(500, {error : 'Internal Server Error'});
    }
  })
});

app.get('/todos', authenticate, function(req, res) {
  var todos = new Todos(req.param('userId'));
  todos.read(function(err, list) {
    if(!err) {
      res.json(list);
    }
  })
});


requirejs.config({
  baseUrl : __dirname,
  nodeRequire : require
});





http.createServer(app).listen(app.get('port'), function() {
  console.log('Server started on port: ' + app.get('port'));
});
