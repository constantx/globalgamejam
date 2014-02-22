
/**
 * make and return enemy
 * @param  {Object} tweet twitter API tweet object
 * @return {Object} an enemy
 */

game.module(
  'enemy.main'
  )
  .body(function() {
    var enemy;

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
     * module for an enemy model
     * @param  {[type]} tweet [description]
     * @return {[type]}       [description]
     */
    Enemy = game.Class.extend({

      init: function(obj) {
        var user = obj.user;
        this.user = user;
        this.name = shuffle(user.screen_name);
        this.hp = user.followers_count;
        this.mp = user.friends_count;
      }

    });

  });
