/* jshint indent:2, devel:true */

(function () {

  "use strict";

  var dom = require('dom');
  var domready = require('domready');

  domready(function() {

    var game = new Phaser.Game(1024, 640, Phaser.AUTO, 'game-container', {
      preload: preload,
      create: create
    }, true);

    function preload () {
      game.load.image('logo', 'img/phaser.png');
    }

    function create () {
      var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
      logo.anchor.setTo(0.5, 0.5);
    }

  });

}());
