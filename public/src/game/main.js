game.module(
  'game.main'
)
.require(
  'engine.core',
  'game.assets',
  'game.objects',
  'game.scenes'
)
.body(function(){

  game.System.hires = true;
  game.System.retina = true;

  // start ( scene  width  height  canvasId )
  game.start(SceneGame, 800, 600, 'game-container');
  game.fullscreen();
});
