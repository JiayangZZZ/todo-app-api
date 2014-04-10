
var sha1 = require('sha1');

/**
 * User
 *
 * @constructor User
 */

function User(username, password, clientId) {
  this.username = username;
  this.secret = 'kjefhuiufwehwfe';
  this.clientId = clientId;
}

/**
 * Put token
 *
 * @param {Function} callback
 * @api public
 */

User.prototype.updateToken = function(callback) {
  var accessToken = this._getHash();
  var expires = Date.now() + 14*24*3600*1000;
  var refreshToken = this._getHash('1');

  // var q = userTable
  //   .update(
  //     tokenTable.subQuery('test')
  //     .leftJoin(userTable)
  //     .on(tokenTable.user_id.equals(userTable.id)))
  //   .where(tokenTable.user_id.equals(userTable.id))
  //   .toQuery();
  //   //left join two tables, use sql text
  // console.log(q.text);

  var q = " update tokens LEFT JOIN users ON (tokens.user_id = users.id)"
          +"  SET access_token = '" + accessToken
          +"', refresh_token = '" + refreshToken
          +"', expires = '" + expires
          +"' WHERE client_id = '" + this.clientId + "' and username ='" + this.username+"'";

  console.log("ok");
  console.log(q);


  db.query(q, q.values, function(err, result) {
    if(!err) {
      return callback(null, {
        accessToken : accessToken,
        refreshToken : refreshToken,
        expires : expires
      });
    }
    callback(err);
  });
}

/**
 * Get hash
 *
 * @return {String} token
 * @api private
 */

User.prototype._getHash = function(modifier) {
  modifier = modifier || '';
  this.accessToken = sha1(this.secret + this.username + Date.now() + modifier);
  return this.accessToken;
}

/**
 * Export
 */

module.exports = User;
