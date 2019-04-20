'use strict';


/**
 * -- Required Packages --
 */
const fs = require('fs');
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const envmod = require('gulp-env-modify');
const favicon = require ('gulp-real-favicon');
const filenames = require("gulp-filenames");
const image = require('gulp-image');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');



/**
 * -- Variables --
 */
let env = envmod.getData();
let dev_folder = env.DEVELOPMENT_FOLDER_NAME;
let dev_css_folder = dev_folder + '/' + env.DEVELOPMENT_CSS_FOLDER_NAME;
let dev_favicon_folder = dev_folder + '/' + env.DEVELOPMENT_FAVICON_FOLDER_NAME;
let dev_fonts_folder = dev_folder + '/' + env.DEVELOPMENT_FONTS_FOLDER_NAME;
let dev_images_folder = dev_folder + '/' + env.DEVELOPMENT_IMAGES_FOLDER_NAME;
let dev_js_folder = dev_folder + '/' + env.DEVELOPMENT_JS_FOLDER_NAME;
let dev_sass_folder = dev_folder + '/' + env.DEVELOPMENT_SASS_FOLDER_NAME;

let dist_folder = env.DISTRIBUTION_FOLDER_NAME;
let dist_css_folder = dist_folder + '/' + env.DISTRIBUTION_CSS_FOLDER_NAME;
let dist_fonts_folder = dist_folder + '/' + env.DISTRIBUTION_FONTS_FOLDER_NAME;
let dist_images_folder = dist_folder + '/' + env.DISTRIBUTION_IMAGES_FOLDER_NAME;
let dist_js_folder = dist_folder + '/' + env.DISTRIBUTION_JS_FOLDER_NAME;

let folders = [
    dev_folder, dev_css_folder, dev_favicon_folder, dev_fonts_folder, dev_images_folder, dev_js_folder, dev_sass_folder,
    dist_folder, dist_css_folder, dist_fonts_folder, dist_images_folder, dist_js_folder
];

let project_title = env.PROJECT_TITLE;

let favicon_name = env.FAVICON_IMAGE_NAME;
let favicon_tile_color = env.FAVICON_TILE_COLOR;
let favicon_theme_color = env.FAVICON_THEME_COLOR;
let zip_file_name = env.ZIP_FILE_NAME;

let css_file_name = env.CSS_FILE_NAME;
let css_file_suffix = env.CSS_FILE_NAME_SUFFIX;

let js_file_name = env.JS_FILE_NAME;
let js_file_suffix = env.JS_FILE_NAME_SUFFIX;



/**
 * @Command: gulp help
 *
 * List all of the available gulp commands
 */
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


/**
 * @Command: gulp setup
 *
 * Create the development and distribution folders
 */
const setup = (done) => {
    folders.forEach(dir => {
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });
    done();
};


/**
 * Compile Sass files
 *
 * Compile each development sass file and save as FILENAME.compiled.css
 */
const compile_sass = () => {
    return gulp.src('./' + dev_sass_folder + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({suffix: '.compiled'}))
        .pipe(gulp.dest('./' + dev_css_folder));
};


/**
 * Minify CSS
 *
 * Combine and minify all development css files
 */
const minify_css = () => {
    return gulp.src('./' + dev_css_folder + '/*.css')
        .pipe(concat(css_file_name + '.css'))
        .pipe(gulp.dest('./' + dist_css_folder))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.' + css_file_suffix}))
        .pipe(gulp.dest('./' + dist_css_folder));
};


/**
 * @Command: gulp js
 *
 * Combine and minify all development js files
 */
const minify_js = () => {
    return gulp.src('./' + dev_js_folder + '/*.js')
        .pipe(concat(js_file_name + '.js'))
        .pipe(gulp.dest('./' + dist_js_folder))
        .pipe(uglify())
        .pipe(rename({suffix: '.' + js_file_suffix}))
        .pipe(gulp.dest('./' + dist_js_folder));
};


/**
 * @Command: gulp images
 *
 * Compress all development image files
 */
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


/**
 * @Command: gulp favicon
 *
 * Generate all favicon images and files
 */
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
                    appName: project_title
                },
                desktopBrowser: {},
                windows: {
                    pictureAspect: 'noChange',
                    backgroundColor: favicon_tile_color,
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
                    appName: project_title
                },
                androidChrome: {
                    pictureAspect: 'noChange',
                    themeColor: favicon_theme_color,
                    manifest: {
                        name: project_title,
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
                    themeColor: favicon_tile_color
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


/**
 * @Command: gulp zip
 *
 * Zip the distribution folder
 */
const zip_assets = () => {
    return gulp.src(dist_folder + '/*').pipe(zip(zip_file_name + '.zip')).pipe(gulp.dest('./'));
};


/**
 * @Command: gulp html
 *
 * Copy html files from development to distribution
 */
const copy_html = () => {
    return gulp.src('./' + dev_folder + '/*.html').pipe(gulp.dest('./' + dist_folder));
};


/**
 * Delete compiled sass files
 */
const delete_compiled_sass = () => {
    return del('./' + dev_css_folder + '/*compiled.css');
};


/**
 * Delete zip file
 */
const delete_zip_file = () => {
    return del(zip_file_name + '.zip');
};


/**
 * Delete distribution folders
 */
const delete_distribution_folders = () => {
    return del(dist_folder + '/*');
};


/**
 * @Command: gulp clean
 *
 * Delete all compiled files
 */
const clean = gulp.series(
    gulp.parallel(delete_compiled_sass, delete_zip_file, delete_distribution_folders),
    setup
);


/**
 * @Command: gulp css
 *
 * Compile scss files, combine and minimise all css files, save to distribution folder
 */
const compile_css = gulp.series(compile_sass, minify_css, delete_compiled_sass);


/**
 * @Command: gulp build
 *
 * Compile all assets
 */
const build = gulp.series(clean,
    gulp.parallel(compile_css, minify_js, copy_html, generate_favicon, minify_images)
);


/**
 * @Command: gulp
 *
 * Compile scss files, combine and minimise all css files
 * Combine and minimise all js files
 */
const css_and_js = gulp.parallel(compile_css, minify_js);


/**
 * -- Available user commands --
 */
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