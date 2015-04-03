module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      app: {
        files: {
          'dist/app.min.js': ['js/qurandata/quran-data.js', 'js/framework7.js', 'js/mozillasocialservice.js']
        }
      }
    },
    'gh-pages': {
      options: {
        base: 'dist',
        dotfiles: true,
        repo: 'https://' + process.env.GH_TOKEN + '@github.com/elsagradocoran/mozillasocialservice.git',
        silent: true
      },
      src: '**/*'
    }
  });
  
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Publish to GitHub Pages with Grunt
  grunt.loadNpmTasks('grunt-gh-pages');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'gh-pages']);

};