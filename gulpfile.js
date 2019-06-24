"use strict";

const
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),

    path = {
        devUrl: 'localurl.au',
        src: {
            sass: 'styles/scss/**/*.scss',
            js: 'scripts/src/main.js',
        },
        watch: {
            sass: 'styles/scss/**/*.scss',
            js: 'scripts/src/main.js',
        },
        build: {
            css: 'styles/css/',
            js: 'scripts/build',
        }
    },

    config = {
        sass: {
            includePaths: [
                'node_modules'
            ]
        },
        autoprefixer: {
            browsers: [
                'Chrome >= 40',
                'Firefox >= 30',
                'Edge >= 12',
                'Explorer >= 10',
                'iOS >= 9',
                'Safari >= 7.1',
                'Android >= 4.4',
                'Opera >= 15'
            ]
        }
    };

function browser_sync()
{
    browserSync.init({
        proxy: path.devUrl
    });

    gulp.watch("*.php").on('change', browserSync.reload);
}

gulp.task('css:build', () => {
    return (
        gulp.src(path.src.sass)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass(config.sass)).on('error', sass.logError)
            .pipe(autoprefixer(config.autoprefixer))
            .pipe(cleanCSS())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(path.build.css))
            .pipe(browserSync.stream())
    );
});

gulp.task('js:build', () => {
    return (
        browserify({ entries: path.src.js })
            .transform(babelify, { presets: ['es2015'] })
            .bundle()
            .pipe(source('app.js'))
            .pipe(gulp.dest(path.build.js))
            .pipe(browserSync.stream())
    );
});

function watch()
{
    gulp.watch(path.watch.sass, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
}

gulp.task('run:browser-sync', gulp.series(browser_sync, watch));
gulp.task('run:default', gulp.series(watch));