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
  var emitterEnemy;

  domready(function() {

    var game = new Phaser.Game(800*2, 640*2, Phaser.CANVAS, 'game-container', {
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

    function create () {
      utils.log('>> phaser create');

      // emitter(x, y, maxParticles) → {Phaser.Emitter}
      emitterEnemy = game.add.emitter(game.world.centerX, 0);
      // makeParticles(keys, frames, quantity, collide, collideWorldBounds)
      emitterEnemy.makeParticles(['space-invader'], 0, 250, true, true);
      emitterEnemy.minParticleSpeed.setTo(-500, -100);
      emitterEnemy.maxParticleSpeed.setTo(200, 500);
      emitterEnemy.maxRotation = 10;
      emitterEnemy.gravity = 20;
      emitterEnemy.bounce.setTo(0.2, 0.2);
      emitterEnemy.angularDrag = 180;

      // start(explode, lifespan, frequency, quantity)
      emitterEnemy.start(false, 3000, 300);

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
        emitterEnemy.add(enemySprite);
      });

    }


    /**
     * The update (and render) functions are called every frame. So on a desktop that'd be around 60 time per second. In update this is where you'd do things like poll for input to move a player, check for object collision, etc. It's the heart of your game really.
     */
    function update() {
      utils.log('>> update');

      // make enemy collidable
      game.physics.collide(emitterEnemy, emitterEnemy);

      // rotate the angle to spray everywhere
      // emitterEnemy.angle += 0.1;
      // if(emitterEnemy.angle >=360) emitterEnemy.angle = 0;
    }


    /**
     * The render function is called AFTER the WebGL/canvas render has taken place, so consider it the place to apply post-render effects or extra debug overlays. For example when building a game I will often put the game into CANVAS mode only and then use the render function to draw lots of debug info over the top of my game.
     */
    function render() {
      // utils.log('>> render');
    }
  });

}());
