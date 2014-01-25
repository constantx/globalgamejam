var utils;
var debug = true;

function init() {
  return {
    log: function() {
      if(debug){
        console.log.apply(console, arguments);
      }
    }
  };
}


module.exports = init();
