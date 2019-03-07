const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './src/scss/fonts.scss',
    // './src/css/some.css',
    './src/scss/style.scss'
];

const jsFiles = [
    // './src/js/some.js',
    './src/js/jquery.spincrement.js',
    './src/js/main.js'
];

function styles() {
    return gulp.src(cssFiles)

        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        // .pipe(gulp.dest('./css'))
        .pipe(concat('all.css'))
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({level: 2}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

/*
    * Copy fonts folder from src to dist. (does not remove files).
*/
function fonts() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
}

// scripts
function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('all.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
}

// images
function images(){
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
}

// remove build folder
function clean() {
    return del(['build/*']);
}

// =================================
// ==== Define Watch ===============
// =================================
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"

        },
        //tunnel: true  // creates a temporary address that the customer can see
    });

    gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch('./src/css/**/*.css', styles); //all files with this extension + in the attached files looks
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html', browserSync.reload);
}


// =================================
// ========= Commands ==============
// =================================

/**
 * Basic Commands
 * ----------------
 *
 * Manual Commands
 * ------------------
 * gulp image - will optimize all images.
 * gulp clean - will delete the dist(build)/output folder, after this command you should call (gulp build) to rebuild it.
 *
 */

gulp.task('styles', styles);
gulp.task('sync-fonts', fonts);
gulp.task('scripts', scripts);
gulp.task('image', images);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
    gulp.parallel( styles, fonts, scripts, images )
));

gulp.task('dev', gulp.series('build', 'watch'));