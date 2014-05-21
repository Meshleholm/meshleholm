'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'app/**/*.js', 'public/javascript/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        undef: true,
        laxcomma: true,
        node: true,
        globals: {
          jQuery: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'meshleholm.js',
        options: {
          args: ['dev'],
          env: {
            PORT: '4040'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.registerTask('default', ['jshint', 'nodemon']);
};
