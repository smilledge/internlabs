module.exports = function ( grunt ) {
  
  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  /**
   * This is the configuration object Grunt uses to give each plugin its 
   * instructions.
   */
  var taskConfig = {

    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    /**
     * The banner is the comment that is placed at the top of our compiled 
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: 
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' */\n'
    },


    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      clear: [
        '<%= tmp_dir %>'
        // '<%= compile_dir %>'
      ]
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {

      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      compile_css: {
        src: [
          '<%= compile_dir %>/app.css'
        ],
        dest: '<%= compile_dir %>/app.min.css'
      },

      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        src: [ 
          '<%= vendor_files.js %>', 
          'module.prefix', 
          '<%= tmp_dir %>/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= app_files.js %>',
          'module.suffix' 
        ],
        dest: '<%= compile_dir %>/app.js'
      }
    },

    /**
     * `ng-min` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngmin: {
      compile: {
        files: [
          {
            src: [ '<%= concat.compile_js.dest %>' ],
            dest: '<%= concat.compile_js.dest %>'
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        files: {
          '<%= compile_dir %>/app.min.js': '<%= concat.compile_js.dest %>'
        }
      }
    },

    /**
     * `less` handles our LESS compilation and uglification automatically.
     * Only our `app.less` file is included in compilation; all other files
     * must be imported from this file.
     */
    less: {
      build: {
        options: {
          compress: true
        },
        files: {
          '<%= compile_dir %>/app.css': '<%= app_files.less %>'
        }
      }
    },


    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [ 
        '<%= app_files.js %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      options: {
        base: 'public/js'
      },
      app: {
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= tmp_dir %>/templates-app.js'
      }
    },


    copy: {
      fonts: {
        files: [
          {
            expand: true,
            cwd: 'public/fonts',
            src: ['**'],
            dest: '<%= compile_dir %>/fonts/'
          }
        ]
      }
    },


    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed 
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files. 
     */
    delta: {

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [ 
          '<%= app_files.js %>',
          '<%= vendor_files.js %>'
        ],
        tasks: [ 'build' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [ 
          '<%= app_files.atpl %>'
        ],
        tasks: [ 'build' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: [ 'public/less/**/*.less', 'public/js/**/*.less' ],
        tasks: [ 'build' ]
      }

    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );


  grunt.renameTask( 'watch', 'delta' );

  /**
   * The default task is to build and compile and watch.
   */
  grunt.registerTask( 'default', [ 'build', 'delta' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean:clear', 
    'html2js', 'jshint', 'less',
    'concat:compile_css', 'concat:compile_js',
    'copy:fonts',
    'clean:clear'
  ]);


  grunt.registerTask( 'compile', [
    'clean:clear', 
    'html2js', 'jshint', 'less',
    'concat:compile_css', 'concat:compile_js', 
    'ngmin', 'uglify',
    'copy:fonts',
    'clean:clear'
  ]);


};
