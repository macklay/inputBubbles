module.exports = function(grunt) {

    grunt.initConfig({
        cssmin: {
            combine: {
                files: {
                    'dist/css/input-bubbles.min.css': ['src/css/input-bubbles.css']
                }
            }
        },
        concat: {
            main: {
                src: [
                    'src/js/cursor-manager.js',
                    'src/js/input-bubbles.js',
                    'src/js/input-bubbles.jquery.js'
                ],
                dest: 'dist/js/input-bubbles.js'
            }
        },
        uglify: {
            main: {
                files: {
                    'dist/js/input-bubbles.min.js': '<%= concat.main.dest %>'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['cssmin', 'concat', 'uglify']);
};