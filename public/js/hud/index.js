/**
 * PHASER GAME HUD
 */
var utils = require('utils');

module.exports = function(game) {
  return {

    style: {
      font: "20px Monaco",
      fill: "#323232",
      align: "left"
    },


    text: function(status) {
      var text = "";

      if (status) {
        text = [
          "Online: " + status.total_player,
          "-------------------------------"
        ].join("\n");
      }

      return text;
    },


    init: function(){
      utils.log('hud#init');
      this.t = game.add.text(10, 10, this.text(), this.style);
      return this;
    },


    update: function(status) {
      utils.log('hud#update', status);
      if (status) {
        this.t.setText(this.text(status));
      }
      return this;
    }
  };
};
