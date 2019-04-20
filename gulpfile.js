'use strict';

const fs = require('fs');
const gulp = require('gulp');
const envmod = require('gulp-env-modify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const favicon = require ('gulp-real-favicon');
const filenames = require("gulp-filenames");
const image = require('gulp-image');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const zip = require('gulp-zip');
const env = envmod.getData();


const help = (done) => {
    console.log("\n\nThis is a list of all available tasks: \n");
    console.log("  (default)  -  preform css and js processes");
    console.log("  build      -  run all processes");
    console.log("  css        -  compile sass files, combine and minify all css files");
    console.log("  js         -  combine and minify all js files");
    console.log("  html       -  copy html files from " + env.DEVELOPMENT_FOLDER_NAME + " folder to " + env.DISTRIBUTION_FOLDER_NAME + " folder");
    console.log("  favicon    -  create favicons from " + env.DEVELOPMENT_FOLDER_NAME + "/" + env.DEVELOPMENT_FAVICON_FOLDER_NAME + "/"+ env.FAVICON_IMAGE_NAME +" image");
    console.log("  images     -  compress all images in " + env.DEVELOPMENT_FOLDER_NAME + "/" + env.DEVELOPMENT_IMAGES_FOLDER_NAME + " and save to " + env.DISTRIBUTION_FOLDER_NAME + "/" + env.DISTRIBUTION_IMAGES_FOLDER_NAME );
    console.log("  zip        -  create zip file of the "  + env.DISTRIBUTION_FOLDER_NAME + " folder called "  + env.ZIP_FILE_NAME + ".zip");
    console.log("  clean      -  delete all compiled files\n\n");
    done();
};


const setup = (done) => {
    const folders = [
        env.DEVELOPMENT_FOLDER_NAME,
        env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_CSS_FOLDER_NAME,
        env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_FAVICON_FOLDER_NAME,
        env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_FONTS_FOLDER_NAME,
        env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_IMAGES_FOLDER_NAME,
        env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_JS_FOLDER_NAME,
        env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_SASS_FOLDER_NAME,

        env.DISTRIBUTION_FOLDER_NAME,
        env.DISTRIBUTION_FOLDER_NAME + '/' + env.DISTRIBUTION_CSS_FOLDER_NAME,
        env.DISTRIBUTION_FOLDER_NAME + '/' + env.DISTRIBUTION_FONTS_FOLDER_NAME,
        env.DISTRIBUTION_FOLDER_NAME + '/' + env.DISTRIBUTION_IMAGES_FOLDER_NAME,
        env.DISTRIBUTION_FOLDER_NAME + '/' + env.DISTRIBUTION_JS_FOLDER_NAME,
    ];

    folders.forEach(dir => {
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });

    del('.git');

    done();
};



const compile_sass = () => {
    return gulp.src('./' + env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_SASS_FOLDER_NAME + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            suffix: '.' + env.DEVELOPMENT_COMPILED_SASS_FILE_NAME_SUFFIX
        }))
        .pipe(gulp.dest('./' + env.DEVELOPMENT_FOLDER_NAME + '/'  + env.DEVELOPMENT_CSS_FOLDER_NAME));
};



const minify_css = () => {
    return gulp.src('./' + env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_CSS_FOLDER_NAME + '/*.css')
        .pipe(concat(env.CSS_FILE_NAME + '.css'))
        .pipe(gulp.dest('./' + env.DISTRIBUTION_FOLDER_NAME + '/css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            prefix: '',
            suffix: '.' + env.CSS_FILE_NAME_SUFFIX
        }))
        .pipe(gulp.dest('./' + env.DISTRIBUTION_FOLDER_NAME + '/css'));
};


const compile_js = () => function() {
    return gulp.src('./' + env.DEVELOPMENT_FOLDER_NAME + '/js/*.js')
        .pipe(concat('pre-production.js'))
        .pipe(gulp.dest('./' + env.DEVELOPMENT_FOLDER_NAME + '/js'))
        .pipe(uglify())
        .pipe(rename("production.min.js"))
        .pipe(gulp.dest('./' + env.DISTRIBUTION_FOLDER_NAME + '/js'));
};



const minify_images = () => {
    return gulp.src('./' + env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_IMAGES_FOLDER_NAME + '/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            jpegoptim: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10
        }))
        .pipe(gulp.dest('./' + env.DISTRIBUTION_FOLDER_NAME + '/' + env.DISTRIBUTION_IMAGES_FOLDER_NAME));
};



const generate_favicon = (done) => {
    favicon.generateFavicon({
        masterPicture: './' + env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_FAVICON_FOLDER_NAME + '/' + env.FAVICON_IMAGE_NAME,
        dest: './' + env.DISTRIBUTION_FOLDER_NAME,
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                },
                appName: env.PROJECT_TITLE
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: env.FAVICON_TILE_COLOR,
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                },
                appName: env.PROJECT_TITLE
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: env.FAVICON_THEME_COLOR,
                manifest: {
                    name: env.PROJECT_TITLE,
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: 53.28125,
                themeColor: env.FAVICON_TILE_COLOR
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: 'faviconData.json'
    }, function() {
        done();
    });
};



const zip_assets = () => {
    return gulp.src(env.DISTRIBUTION_FOLDER_NAME + '/*')
        .pipe(zip(env.ZIP_FILE_NAME + '.zip'))
        .pipe(gulp.dest('./'));
};


const clean = () => {
    return del([
        env.DEVELOPMENT_FOLDER_NAME + '/' + env.DEVELOPMENT_CSS_FOLDER_NAME + '/*' + env.DEVELOPMENT_COMPILED_SASS_FILE_NAME_SUFFIX + '.css',
        env.DISTRIBUTION_FOLDER_NAME + '/*',
        env.ZIP_FILE_NAME + '.zip'
    ]);
};



const copy_html = () => {
    return gulp.src('./' + env.DEVELOPMENT_FOLDER_NAME + '/*.html')
        .pipe(gulp.dest('./' + env.DISTRIBUTION_FOLDER_NAME));
};




const compile_css = gulp.series(compile_sass, minify_css);

const build = gulp.series(
    clean,
    gulp.parallel(compile_css, copy_html, generate_favicon, minify_images)
);

const css_and_js = gulp.series(
    clean,
    gulp.parallel(compile_css, compile_js)
);



exports.help = help;

exports.setup = setup;

exports.default = css_and_js;

exports.build = build;

exports.css = compile_css;

exports.js = compile_js;

exports.favicon = generate_favicon;

exports.images = minify_images;

exports.html = copy_html;

exports.zip = zip_assets;

exports.clean = clean;

