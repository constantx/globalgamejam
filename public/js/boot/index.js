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

    var wWidth = document.body.clientWidth;
    var wHeight = document.body.clientHeight;
    var game = new Phaser.Game(wWidth*2, wHeight*2, Phaser.CANVAS, 'game-container', {
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

      game.load.image('space-invader', 'img/enemy.png');
    }

    /**
     * The create function is called automatically once the preload has finished
     */

    var enemyStream = ['stream1', 'stream2'];
    var emitterEnemy;

    function create () {
      utils.log('>> phaser create');


      enemyStream.forEach(function(stream, i){

        // emitter(x, y, maxParticles) → {Phaser.Emitter}
        emitterEnemy = game.add.emitter(game.world.centerX, game.world.centerY);

        // makeParticles(keys, frames, quantity, collide, collideWorldBounds)
        emitterEnemy.makeParticles(['space-invader'], 0, 250, true, true);
        emitterEnemy.minParticleSpeed.setTo(-500, -500);
        emitterEnemy.maxParticleSpeed.setTo(500, 500);
        emitterEnemy.maxParticleScale = 1;
        emitterEnemy.minParticleScale = 0.1;
        emitterEnemy.maxRotation = 10;
        emitterEnemy.gravity = 0;
        emitterEnemy.bounce.setTo(0.5, 0.5);
        emitterEnemy.angularDrag = 1;

        // start(explode, lifespan, frequency, quantity)
        emitterEnemy.start(false, 20000, 500);
      });

      // create the hud
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
        utils.log("newEnemy ", newEnemy);
      });

    }


    /**
     * The update (and render) functions are called every frame. So on a desktop that'd be around 60 time per second. In update this is where you'd do things like poll for input to move a player, check for object collision, etc. It's the heart of your game really.
     */
    var enemyDoF;

    function update() {
      utils.log('>> update');

      // make enemy collidable
      game.physics.collide(emitterEnemy, emitterEnemy);

      enemyDoF = Math.random();
      emitterEnemy.scale = enemyDoF;
      emitterEnemy.gravity = Math.random();
    }


    /**
     * The render function is called AFTER the WebGL/canvas render has taken place, so consider it the place to apply post-render effects or extra debug overlays. For example when building a game I will often put the game into CANVAS mode only and then use the render function to draw lots of debug info over the top of my game.
     */
    function render() {
      // utils.log('>> render');
    }
  });

}());
