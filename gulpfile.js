// Gulp.js configuration

// gulp and plugins (auto-loaded)
var
  gulp = require('gulp'),
  gp = require('gulp-load-plugins')(),
  del = require('del'),
  // browsersync = require('browser-sync'),
  pkg = require('./package.json');


// file locations
var
  devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),

  // do not use absolute ./paths - watch fails to detect new and deleted files
  source = 'src/',
  dest = 'dest/',

  // postcss processing
  css = {
    in: [source + 'css/styles.scss'],
    watch: [source + 'css/**/*'],
    out: dest + 'css/',
    processors: [
      require('postcss-import')({ from: source + 'css/styles.scss' }),
      require('postcss-mixins'),
      require('postcss-simple-vars'),
      require('postcss-nested'),
      function (css) {
        css.eachDecl('font-family', function(decl) {
          //console.log(decl);
          decl.value = decl.value + ', sans-serif';
        })
      },
      require('autoprefixer-core')({ browsers: ['last 2 versions', '> 2%'] })
    ]
  }
;

// production build only
if (!devBuild) {
  css.processors.push(require('csswring'));
}

// show build type
console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' : 'production') + ' build');


// clean the build folder
gulp.task('clean', function() {
  del([
    dest + '*'
  ]);
});


// compile CSS
gulp.task('css', function() {
  return gulp.src(css.in)
    .pipe(gp.postcss(css.processors))
    .pipe(gp.rename({ extname: '.css' }))
    .pipe(gulp.dest(css.out));
});


// watch for file changes
gulp.task('watch', function() {

  // CSS update
  gulp.watch(css.watch, ['css']);

});


// default task
gulp.task('default', ['css', 'watch']);
