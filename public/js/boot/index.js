/* jshint indent:2, devel:true, browser:true */
/*global Phaser:true */

(function () {

  "use strict";

  var dom = require('dom');
  var domready = require('domready');
  var socket = window.io.connect(window.location.hostname);
  var Enemy = require('enemy');
  var HUD = require('hud');
  var utils = require('utils');

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
      utils.log('>> phaser preload');
      game.load.image('logo', 'img/phaser.png');
    }

    /**
     * The create function is called automatically once the preload has finished
     */

    function create () {
      utils.log('>> phaser create');

      var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
      logo.anchor.setTo(0.5, 0.5);

      var hud = new HUD(game).init();

      // tell the server there's a new player
      socket.emit("player:join");

      // listen for welcome message
      socket.on("player:welcome", function(status){
        hud.update(status);
      });

      // listen for disconnect message
      socket.on("player:disconnect", function(status){
        hud.update(status);
      });

      socket.on("game:tweet", function(tweet) {
        var newEnemy = new Enemy(tweet);
      });
    }


    /**
     * The update (and render) functions are called every frame. So on a desktop that'd be around 60 time per second. In update this is where you'd do things like poll for input to move a player, check for object collision, etc. It's the heart of your game really.
     */
    function update() {
      // utils.log('>> update');
    }


    /**
     * The render function is called AFTER the WebGL/canvas render has taken place, so consider it the place to apply post-render effects or extra debug overlays. For example when building a game I will often put the game into CANVAS mode only and then use the render function to draw lots of debug info over the top of my game.
     */
    function render() {
      // utils.log('>> render');
    }
  });

}());
