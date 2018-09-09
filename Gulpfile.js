//Dependencies
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    uglifyEs = require('gulp-uglifyes'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    images = require('gulp-imagemin');


//paths
var styleSrc = 'src/sass/**/*.sass',
    styleDest = 'build/css',
    scriptSrc = 'src/js/*.js',
    scriptDest = 'build/js',
    vendorSrc = 'node_modules/',
    vendorDest = 'build/js';


// Compiles all SASS files
gulp.task('sass',function(){
    gulp.src('./src/sass/**/*.sass')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        style: 'compressed'
    }))
    .pipe(minifycss())
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css/'));
});

// Uglify js files
gulp.task('scripts',function(){
    gulp.src(scriptSrc)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(scriptDest));
});

// Concat and Compress Vender .js files
gulp.task('vendorsjs',function(){
    gulp.src(
        [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/popper.js/dist/popper.js',
            'node_modules/bootstrap/dist/js/bootstrap.js'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglifyEs({
            mangle: false,
            ecma: 6
        }))
        .pipe(concat('vendors.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(scriptDest));
});

// Concat and Compress Vendor .css files
gulp.task('vendorscss',function(){
    gulp.src(
        [
            'node_modules/bootstrap/dist/css/bootstrap.css'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(minifycss())
        .pipe(concat('vendors.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(styleDest));
});

//Watch for changes
gulp.task('watch',function(){
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });
    gulp.watch(styleSrc,['sass']);
    gulp.watch(['build/*.html','build/css/*.css','build/js/*.js']).on('change',browserSync.reload);

});

gulp.task('default',['sass','scripts','vendorsjs','vendorscss','watch'],function(){});
