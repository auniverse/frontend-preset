let gulp = require('gulp');
let plumber = require('gulp-plumber');
let sass = require('gulp-sass');
let browserSync = require('browser-sync').create();
let sourcemaps = require('gulp-sourcemaps');
let autoprefixer = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');

let path = {
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
};

let config = {
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

gulp.task('browser-sync', ['css:build'], () => {
    browserSync.init({
        proxy: path.devUrl
    });

    gulp.watch("*.php").on('change', browserSync.reload);
});

gulp.task('css:build', () => {
    return gulp.src(path.src.sass)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(config.sass)).on('error', sass.logError)
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('js:build', () => {
    return browserify({ entries: path.src.js })
        .transform(babelify, { presets: ['es2015'] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('default', ['browser-sync'], () => {
    gulp.watch(path.watch.sass, ['css:build']);
    gulp.watch(path.watch.js, ['js:build']);
});