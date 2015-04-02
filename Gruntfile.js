module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      app: {
        files: {
          'dist/app.min.js': ['js/qurandata/quran-data.js', 'js/framework7.js', 'js/mozillasocialservice.js']
        }
      }
    }
  });
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};