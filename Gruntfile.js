/* jshint node:true */

(function() {
  "use strict";

  module.exports = function(grunt) {
    grunt.initConfig({
      pkg: "<json:package.json>",
      dirs: {
        app: "."
      },
      meta: {
        name: "<%= pkg.name %>",
        banner: "/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"m/d/yyyy\") %>\n" + "* <%= pkg.homepage %>\n" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;*/"
      },
      jshint: {
        options: {
          curly: true,
          globals: {
            require: true
          }
        },
        files: [
          "**/*.js",
          "!public/build/*.js",
          "!public/js/libs/*.js",
          "!node_modules/**/*.js",
          "!components/**/*.js"
        ]
      },
      stylus: {
        app: {
          options: {
            compress: false
          },
          files: [
            {
              expand: true,
              cwd: "<%= dirs.app %>/stylus",
              src: ["**/*.styl", "!partials/*.styl"],
              dest: "<%= dirs.app %>/public/css/",
              ext: ".css"
            }
          ]
        }
      },
      nodemon: {
        dev: {
          options: {
            file: 'server.js',
            ignoredFiles: [
              "*.css",
              "*.styl",
              "*.jade",
              "readme*",
              "Gruntfile*",
              "Makefile*",
              "Procfile*",
              ".slugignore",
              ".git",
              "public/js/**/*.js",
              "public/build/*.js"
            ],
            debug: true,
            delayTime: 1
          }
        }
      },
      componentbuild: {
        build: {
          options: {
            dev: true,
            sourceUrls: true
          },
          src: './',
          dest: '<%= dirs.app %>/public/build/'
        }
      },
      notify: {
        compiled: {
          options: {
            message: 'Assets compiled'
          }
        },
        stylus: {
          options: {
            message: 'Stylus compiled'
          }
        }
      },
      concurrent: {
        dev: {
          tasks: ['nodemon', 'watch'],
          options: {
            logConcurrentOutput: true
          }
        },
        compile: {
          tasks: ['stylus', 'componentbuild']
        }
      },
      watch: {
        options: {
          interrupt: true,
          nospawn: true
        },
        stylus: {
          files: "<%= stylus.app.files[0].cwd %>/**/*.styl",
          tasks: ["stylus", "notify:stylus"]
        },
        jshint: {
          files: "<%= jshint.files %>",
          tasks: ["jshint"]
        },
        component: {
          files: "<%= jshint.files %>",
          tasks: ["compile"]
        }
      }
    });

    /**
     * REQUIRES ALL THE GRUNTS
     */
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    /**
     * TASKS
     */
    grunt.registerTask("compile", [
      "concurrent:compile",
      "notify:compiled"
    ]);

    grunt.registerTask("build", ["compile"]);

    grunt.registerTask("default", ["compile", "concurrent:dev"]);

    return grunt;
  };

}).call(this);
