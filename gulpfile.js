var gulp = require('gulp');
var webserver = require('gulp-webserver');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = typescript.createProject("tsconfig.json");

gulp.task('compileTs', function () {
  return gulp
    .src("src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(typescript(tsProject))
    .pipe(sourcemaps.write('.', {sourceRoot: '/src'}))
    .pipe(gulp.dest('build'));
});

gulp.task('html', function() {
  gulp.src('src/**/*.html');
});

gulp.task('css', function() {
  gulp.src('src/**/*.css');
});

gulp.task('copyResources', function () {
  return gulp
    .src(["src/**/*", "!**/*.ts"])
        .pipe(gulp.dest("build"));
});

gulp.task('copyLibs', function() {
  return gulp
    .src([
      'core-js/client/shim.min.js',
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'reflect-metadata/Reflect.js',
      'rxjs/**',
      'zone.js/dist/**',
      '@angular/**'
    ], {cwd: "node_modules/**"})
    .pipe(gulp.dest("build/lib"));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.ts', ['compileTs']);
  gulp.watch('src/css/*.css', ['css']);
  gulp.watch('src/**/*.html', ['html']);
});

gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('default', ['copyLibs', 'copyResources', 'compileTs', 'watch', 'webserver']);
