
GLOBAL.todoTable = sql.define({
  name: 'todos',
  columns: ['id', 'user_id', 'created_time', 'title', 'description', 'status']
});

/**
 * Todo
 *
 * @constructor Todo
 */

function Todo (opts) {
  if(opts.id) this.todoId = opts.id;
  if(opts.userId) this.userId = opts.userId;
  if(opts.title) this.title = opts.title;
  if(opts.description) this.description = opts.description;
  if(opts.accessToken) this.accessToken = opts.accessToken;
}

// var q3 = todoTable
//   . select('*')
//   . from(todoTable)
//   . toQuery();

// var todos;
// db.query(q.text, q.values, function(err, result) {
//   todos = result;
// });


Todo.prototype.create = function(callback) {

  var q = todoTable
    .insert({
      user_id : this.userId,
      title : this.title,
      description : this.description,
      status : 1
    }).toQuery();

  db.query(q.text, q.values, function(err, result) {
    if(!err){
      return callback(null, result);
    }
    callback(err);
  });
}

Todo.prototype.delete = function(callback) {
  var q = todoTable
    .delete()
    .where(todoTable.id.equals(this.todoId)
      ).toQuery();

console.log(q.values);
console.log(this.todoId);

  db.query(q.text, q.values, function(err, result) {
    console.log(err, result)

    if(!err)
      return callback(null, result);
    callback(err);
  });
}

Todo.prototype.update = function(callback) {
  var q = todoTable
    .update({
      id : this.todoId,
      user_id : this.userId,
      title : this.title,
      description : this.description,
      status : '1'
    }).where(todoTable.id.equals(this.todoId))
    .toQuery();
    console.log(q.text);

    db.query(q.text, q.values, function(err, result) {
    if(!err)
      return callback(null, result);
    callback(err);
   });
}

Todo.prototype.read = function(callback) {
  var q = todoTable
    .select('*')
    .from(todoTable)
    .where(todoTable.id.equals(this.todoId))
    .toQuery();

   db.query(q.text, q.values, function(err, result) {
    if(!err)
      return callback(null, result);
    callback(err);
   });
}

// function viewList(err, todos) {
//   if(!err) {
//     if(todos.length === 0) {
//       return res.send('there is no todo');
//     }
//     else {
//       res.json([

//       ])
//     }
//   }
// };

module.exports = Todo;


