'use strict';

var gulp = require('gulp'),

    // Sass/CSS Processes
    bourbon = require('bourbon').includePaths,
    neat = require('bourbon-neat').includePaths,
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssMQpacker = require('css-mqpacker'),
    sourcemaps = require('gulp-sourcemaps'),
    cssMinify = require('gulp-cssnano'),
    sassLint = require('gulp-sass-lint'),

    // Utilities
    rename = require( 'gulp-rename'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

/****************************
 * CSS Tasks
************************* */

/*
 * PostCSS Task Handler
 */
gulp.task('postcss', function() {

    return gulp.src('assets/sass/style.scss')

        // Error Handler
        .pipe(plumber({
            errorHandler: handleErrors
        }))

        // Wrap tasks in a sourcemap
        .pipe( sourcemaps.init())

        .pipe( sass({
            includePaths: [].concat( bourbon, neat ),
            errLogToConsole: true,
            outputStyle: 'expanded' // Options: nested, expanded, compact, compressed
        }))

        .pipe( postcss([
            autoprefixer({
                browsers: ['last 2 versions']
            }),
            // cssMQpacker({
            //     sort: false
            // })
        ]))

        //creates sourcemap
        .pipe(sourcemaps.write())

        .pipe(gulp.dest('./'));
});

/****************************
 * Utilities
************************* */


/*
 * Error Handler
 *
 * @function
 */
function handleErrors() {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title: 'Task Failed [<%= error.message %>',
        message: 'See console.',
        sound: 'Sosumi' // https://github.com/mikaelbr/node-notifier#all-notification-options-
    }).apply(this, args);

    gutil.beep(); // Beep 'sosumi' again

    // Prevent the 'watch' task from stopping
    this.emit('end');
}

gulp.task('sass:lint', ['cssMinify'], function(){
    gulp.src([
        'assets/sass/style.scss',
        '!assets/sass/base/html5-reset/_normalize.scss',
        '!assets/sass/utilities/animate/**/*.*'
    ])

        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

/****************************
 * All Task Listeners
************************* */


gulp.task('cssMinify', ['postcss'], function() {
    return gulp.src('style.css')

    // Error Handler
    .pipe(plumber({
        errorHandler: handleErrors
    }))

    .pipe(cssMinify({
        safe:true
    }))

    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./'))
    .pipe(notify({
        message: 'Styles are built.'
    }))
});

gulp.task('watch', function(){
    gulp.watch('assets/sass/**/*.scss', ['styles']);
});

/**
 * Individual tasks
 */

// gulp.task('scripts', [''])
gulp.task('styles', ['sass:lint'] );