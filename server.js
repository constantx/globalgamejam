/* jshint indent:2, node:true */

(function() {
  "use strict";

  require('coffee-script');

  require('colors');

  var express = require("express");
  var http = require("http");
  var path = require("path");
  var fs = require("fs");
  var app = express();
  var server = http.createServer(app);
  var io = require("socket.io").listen(server);
  var PORT = process.env.PORT || 5000;
  var routes = require("./routes");

  // keyword for tracking
  var KEYWORD = ["bad", "evil", "sinister"];

  // keep track of players with sockets
  var players = {};

  // twitter API client: https://github.com/ttezel/twit
  var Twit = require('twit');

  // create a new twitter client
  var T = new Twit({
    consumer_key:         process.env.consumer_key,
    consumer_secret:      process.env.consumer_secret,
    access_token:         process.env.access_token,
    access_token_secret:  process.env.access_token_secret
  });

  //  filter the twitter public stream by the word 'mango'.
  var stream = T.stream('statuses/filter', { track: KEYWORD });

  // config the sever
  app.configure(function() {
    app.set("port", PORT);
    app.set("views", "" + __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express["static"](path.join(__dirname, "public/")));
    return;
  });

  app.configure("development", function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    app.locals.pretty = true;
    return;
  });

  app.configure("production", function() {
    app.use(express.errorHandler());
    return;
  });

  app.get("/", routes.index);

  if (!module.parent) {
    server.listen(app.get("port"), function() {
      console.log(("\n\n==================================================\nExpress server running on: http://localhost:" + (app.get("port")) + "\n==================================================").green);
      return;
    });
  }

  io.configure("development", function() {
    io.set("log level", 2);
    return;
  });

  io.configure("production", function() {
    io.set("transports", ["websocket", "flashsocket", "htmlfile", "xhr-polling", "jsonp-polling"]);
    io.set("polling duration", 3);
    io.enable("browser client minification");
    io.enable("browser client etag");
    io.enable("browser client gzip");
    io.set("log level", 1);
    return;
  });


  /**
   * add player to pool and send a number of total player
   */
  io.sockets.on("connection", function(socket) {
    players[socket.id] = socket;

    socket.on("game:join", function() {
      socket.emit("player:welcome", {
        total_player : Object.keys(players).length
      });
    });
    return;
  });


  /**
   * send the tweet to all client when available
   */
  stream.on('tweet', function (tweet) {
    io.sockets.emit("game:tweet", tweet);
  });


  /**
   * remove player when disconnect
   */
  io.sockets.on("disconnect", function(socket) {
    delete players[socket.id];

    return;
  });

}).call(this);
