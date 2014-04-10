
function Todos(userId) {
 this.userId = userId;
}


Todos.prototype.read = function(callback) {
  var q = todoTable
    .select('*')
    .from(todoTable)
    .where(todoTable.user_id.equals(this.userId))
     .and(todoTable.status.equals(1))
    .toQuery();

  db.query(q.text, q.values, function(err, result) {
    if(!err) {
      return callback(null, result);
    }
  });
}

module.exports = Todos;
