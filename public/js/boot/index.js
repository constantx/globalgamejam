/* jshint indent:2, devel:true, browser:true */
/*global Phaser:true */

(function () {

  "use strict";

  var dom = require('dom');
  var domready = require('domready');
  var socket = window.io.connect(window.location.hostname);
  var Enemy = require('enemy');

  domready(function() {

    var game = new Phaser.Game(1024*2, 640*2, Phaser.CANVAS, 'game-container', {
      preload: preload,
      create: create,
      update: update,
      render: render
    }, true);

    /**
     * preload is run once before the game start
     * @return {[type]} [description]
     */
    function preload () {
      console.log('>> preload');
      game.load.image('logo', 'img/phaser.png');
    }

    /**
     * The create function is called automatically once the preload has finished
     */

    function create () {
      console.log('>> create');
      var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
      logo.anchor.setTo(0.5, 0.5);

      // socket it up
      socket.emit("game:join");
      socket.on("player:welcome", function(res) {
        // console.log('player:welcome', res);

        if (res && res.total_player) {
          var text = "Online: " + res.total_player;
          var style = { font: "20px Monaco", fill: "#323232", align: "left" };
          var t = game.add.text(10, 10, text, style);
        }
      });

      socket.on("game:tweet", function(tweet) {
        var newEnemy = new Enemy(tweet);
      });
    }


    /**
     * The update (and render) functions are called every frame. So on a desktop that'd be around 60 time per second. In update this is where you'd do things like poll for input to move a player, check for object collision, etc. It's the heart of your game really.
     */
    function update() {
      // console.log('>> update');
    }


    /**
     * The render function is called AFTER the WebGL/canvas render has taken place, so consider it the place to apply post-render effects or extra debug overlays. For example when building a game I will often put the game into CANVAS mode only and then use the render function to draw lots of debug info over the top of my game.
     */
    function render() {
      // console.log('>> render');
    }
  });

}());
