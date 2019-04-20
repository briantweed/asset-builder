'use strict';

const fs = require('fs');
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const envmod = require('gulp-env-modify');
const env = envmod.getData();
const favicon = require ('gulp-real-favicon');
const filenames = require("gulp-filenames");
const image = require('gulp-image');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');


const dev_folder = env.DEVELOPMENT_FOLDER_NAME;
const dev_css_folder = dev_folder + '/' + env.DEVELOPMENT_CSS_FOLDER_NAME;
const dev_favicon_folder = dev_folder + '/' + env.DEVELOPMENT_FAVICON_FOLDER_NAME;
const dev_fonts_folder = dev_folder + '/' + env.DEVELOPMENT_FONTS_FOLDER_NAME;
const dev_images_folder = dev_folder + '/' + env.DEVELOPMENT_IMAGES_FOLDER_NAME;
const dev_js_folder = dev_folder + '/' + env.DEVELOPMENT_JS_FOLDER_NAME;
const dev_sass_folder = dev_folder + '/' + env.DEVELOPMENT_SASS_FOLDER_NAME;

const dist_folder = env.DISTRIBUTION_FOLDER_NAME;
const dist_css_folder = dist_folder + '/' + env.DISTRIBUTION_CSS_FOLDER_NAME;
const dist_fonts_folder = dist_folder + '/' + env.DISTRIBUTION_FONTS_FOLDER_NAME;
const dist_images_folder = dist_folder + '/' + env.DISTRIBUTION_IMAGES_FOLDER_NAME;
const dist_js_folder = dist_folder + '/' + env.DISTRIBUTION_JS_FOLDER_NAME;

const favicon_name = env.FAVICON_IMAGE_NAME;
const zip_file_name = env.ZIP_FILE_NAME;


const help = (done) => {
    console.log("\n\nThis is a list of all available tasks: \n");
    console.log("  (default)  -  preform css and js processes");
    console.log("  build      -  run all processes");
    console.log("  css        -  compile sass files, combine and minify all css files");
    console.log("  js         -  combine and minify all js files");
    console.log("  html       -  copy html files from " + dev_folder + " to " + dist_folder + " folder");
    console.log("  favicon    -  create favicons from " + dev_favicon_folder + "/" + favicon_name);
    console.log("  images     -  compress all images in " + dev_images_folder + " and save to " + dist_images_folder );
    console.log("  zip        -  create zip file from the "  + dist_folder + " folder called "  + zip_file_name + ".zip");
    console.log("  clean      -  delete all compiled files\n\n");
    done();
};


const setup = (done) => {
    const folders = [
        dev_folder,
        dev_css_folder,
        dev_favicon_folder,
        dev_fonts_folder,
        dev_images_folder,
        dev_js_folder,
        dev_sass_folder,

        dist_folder,
        dist_css_folder,
        dist_fonts_folder,
        dist_images_folder,
        dist_js_folder
    ];

    folders.forEach(dir => {
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });

    // del('.git');

    done();
};



const compile_sass = () => {
    return gulp.src('./' + dev_sass_folder + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            suffix: '.compiled'
        }))
        .pipe(gulp.dest('./' + dev_css_folder));
};



const minify_css = () => {
    return gulp.src('./' + dev_css_folder + '/*.css')
        .pipe(concat(env.CSS_FILE_NAME + '.css'))
        .pipe(gulp.dest('./' + dist_css_folder))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.' + env.CSS_FILE_NAME_SUFFIX
        }))
        .pipe(gulp.dest('./' + dist_css_folder));
};



const minify_js = () => {
    return gulp.src('./' + dev_js_folder + '/*.js')
        .pipe(concat(env.JS_FILE_NAME + '.js'))
        .pipe(gulp.dest('./' + dist_js_folder))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.' + env.JS_FILE_NAME_SUFFIX
        }))
        .pipe(gulp.dest('./' + dist_js_folder));
};



const minify_images = () => {
    return gulp.src('./' + dev_images_folder + '/*')
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
        .pipe(gulp.dest('./' + dist_images_folder));
};



const generate_favicon = (done) => {
    let master_favicon = dev_favicon_folder + '/' + favicon_name;
    if (fs.existsSync('./' + master_favicon)) {
        favicon.generateFavicon({
            masterPicture: './' + master_favicon,
            dest: './' + dist_folder,
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
            markupFile: 'favicon-data.json'
        }, function() {
            done();
        });
    } else {
        console.log('Favicon not generated, ' + master_favicon + ' not found');
        done();
    }
};


const zip_assets = () => {
    return gulp.src(dist_folder + '/*')
        .pipe(zip(zip_file_name + '.zip'))
        .pipe(gulp.dest('./'));
};



const delete_compiled_sass = () => {
    return del('./' + dev_css_folder + '/*compiled.css');
};


const delete_zip_file = () => {
    return del(zip_file_name + '.zip');
};


const delete_distribution_folders = () => {
    return del(dist_folder + '/*');
};


const copy_html = () => {
    return gulp.src('./' + dev_folder + '/*.html')
        .pipe(gulp.dest('./' + dist_folder));
};

const clean = gulp.series(
    gulp.parallel(
        delete_compiled_sass,
        delete_zip_file,
        delete_distribution_folders
    ),
    setup
);

const compile_css = gulp.series(
    compile_sass,
    minify_css,
    delete_compiled_sass
);

const build = gulp.series(
    clean,
    gulp.parallel(
        compile_css,
        minify_js,
        copy_html,
        generate_favicon,
        minify_images
    )
);

const css_and_js = gulp.series(
    gulp.parallel(compile_css, minify_js)
);


exports.help = help;

exports.setup = setup;

exports.default = css_and_js;

exports.build = build;

exports.css = compile_css;

exports.js = minify_js;

exports.favicon = generate_favicon;

exports.images = minify_images;

exports.html = copy_html;

exports.zip = zip_assets;

exports.clean = clean;

