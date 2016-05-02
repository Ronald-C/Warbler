module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
	    , browserify: {
		    js: {
                src: "client/app.dev.js"
                , dest: "client/app.js"
            }
	    }

        , clean: {
            contents: ['public/*']
        }

        , watch: {
            files: ['client/**/*.js', '!client/app.js']
            , tasks: ['browserify']
        }

        , uglify: {
            my_target: {
                files: {
                    "client/app.js": ["client/app.js"]
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['browserify', 'uglify']);
}
