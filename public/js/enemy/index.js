/**
 * module for an enemy model
 * @param  {[type]} tweet [description]
 * @return {[type]}       [description]
 */

function shuffle(str) {
  var a = str.split(""),
      n = a.length;

  for(var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
  }
  return a.join("");
}

/**
 * make and return enemy
 * @param  {Object} tweet twitter API tweet object
 * @return {Object} an enemy
 */
module.exports = function(tweet){
  var user = tweet.user;
  var name = shuffle(user.screen_name);
  var hp = user.followers_count;
  var mp = user.friends_count;

  return {
    name: name,
    hp: hp,
    mp: mp
  };
};
