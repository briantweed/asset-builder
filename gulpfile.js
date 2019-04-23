'use strict';




/**
 * ----- Required Packages -----
 */
const fs = require('fs');
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const envmod = require('gulp-env-modify');
const favicon = require ('gulp-real-favicon');
const filelist = require("gulp-filelist");
const image = require('gulp-image');
const minimist = require('minimist');
const notify =  require('gulp-notify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');





/**
 * ----- Variables -----
 */
let env = envmod.getData();

let export_folder = env.EXPORT_FOLDER_NAME;

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
    export_folder,
    dev_folder, dev_css_folder, dev_favicon_folder, dev_fonts_folder, 
    dev_images_folder, dev_js_folder, dev_sass_folder,
    dist_folder, dist_css_folder, dist_fonts_folder, dist_images_folder, dist_js_folder
];

let project_author = env.PROJECT_AUTHOR;
let project_title = env.PROJECT_TITLE;
let template_name = env.HTML_TEMPLATE_FILE_NAME;

let favicon_name = env.FAVICON_IMAGE_NAME;
let favicon_tile_color = env.FAVICON_TILE_COLOR;
let favicon_theme_color = env.FAVICON_THEME_COLOR;
let zip_file_name = env.ZIP_FILE_NAME;

let css_file_name = env.CSS_FILE_NAME;
let css_file_suffix = env.CSS_FILE_NAME_SUFFIX;

let js_file_name = env.JS_FILE_NAME;
let js_file_suffix = env.JS_FILE_NAME_SUFFIX;





/**
 * ==============================================================================================
 */





/**
 * Capitalize the first letter of a word
 *
 * @param string
 * @returns {string}
 */
const capitalize = (string) => {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1)
};


/**
 * Create timestamp in the format Y_m_d_h_i_s
 *
 * @returns {string}
 */
const timestamp = () => {
    return new Date().getFullYear() + '_' +
        (("0" + (new Date().getMonth() + 1)).slice(-2)) + '_' +
        (("0" + new Date().getDate()).slice(-2)) + '_' +
        (("0" + new Date().getHours()).slice(-2)) + '_' +
        (("0" + new Date().getMinutes()).slice(-2)) + '_' +
        (("0" + new Date().getSeconds()).slice(-2));
};


/**
 * Return list containing links for all template files
 *
 * @returns {string}
 */
const template_links = () => {
    let string = "";
    let links = require('./src/links.json');
    let names = require('./src/names.json');
    for (let i = 0; i < links.length; i++) {
        string += "<li class='nav-item'><a class='nav-link' href='" + links[i] + "'>" + capitalize(names[i]) + "</a></li>\n";
    }
    return string;
};


/**
 * Create json file containing template names
 *
 * @param file
 * @param options
 * @returns {*}
 */
const create_link_list = (file, options) => {
    return gulp.src('./' + dev_folder + '/*.html')
        .pipe(filelist(file + '.json', options))
        .pipe(gulp.dest('./src'));
};


/**
 * Compile sass files
 */
const compile_sass = () => {
    return gulp.src('./' + dev_sass_folder + '/**/*.scss')
        .pipe(sass({includePaths: ['node_modules']}))
        .pipe(rename({suffix: '.compiled'}))
        .pipe(gulp.dest('./' + dev_css_folder));
};


/**
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
 * Delete compiled sass files
 */
const delete_compiled_sass = () => {
    return del('./' + dev_css_folder + '/*compiled.css');
};


/**
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
 * Compress images in development folder
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
 * Delete images from distribution folder
 */
const delete_compressed_images = () => {
    return del(dist_images_folder + '/*');
};


/**
 * Delete all exported files
 */
const deleted_exports = () => {
    return del('./' + export_folder + '/*');
};


/**
 * Delete distribution folders
 */
const delete_distribution_folders = () => {
    return del(dist_folder + '/*');
};


/**
 * Delete any existing templates from the distribution folder
 */
const delete_copied_html = () => {
    return del(['./' + dist_folder + '/*.html', '!./' + dist_folder + '/index.html']);
};


/**
 * Get the names of the html files
 */
const get_html_names = () => {
    return create_link_list('names', { flatten: true, removeExtensions: true });
};


/**
 * Get the html file links
 */
const get_html_links = () => {
    return create_link_list('links', { flatten: true });
};


/**
 * Delete cached json files
 */
const delete_cached_files = (done) => {
    delete require.cache[require.resolve('./src/links.json')];
    delete require.cache[require.resolve('./src/names.json')];
    done();
};


/**
 * Create landing page with links to template files
 *
 * @TODO - replace tags in distribution folder instead of on creation
 */
const create_html_link_page = (done) => {
    let links = template_links();
    gulp.src('./templates/index.html')
        .pipe(replace('{{ links }}', links))
        .pipe(replace('{{ project_title }}', project_title))
        .pipe(replace('{{ project_author }}', project_author))
        .pipe(gulp.dest(dist_folder));
    done();
};


/**
 * Copy html files from development to distribution
 */
const copy_html = () => {
    return gulp.src('./' + dev_folder + '/*.html')
        .pipe(gulp.dest('./' + dist_folder));
};


/**
 * Delete files containing list of template names
 */
const delete_html_names = () => {
    return del(['./src/links.json', './src/names.json']);
};


/**
 * Create favicon images and files
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
            markupFile: './src/favicon-data.json'
        }, function() {
            done();
        });
    } else {
        console.log('Favicon not generated, ' + master_favicon + ' not found');
        done();
    }
};


/**
 * Creat html file
 * @TODO - replace tags in distribution folder instead of on creation
 */
const create_template = () => {
    let options = minimist(process.argv.slice(3));
    if (options.name !== undefined && options.name !== true) {
        let page_name = options.name + '.html';
        if (!fs.existsSync('./' + dev_folder + '/' + page_name)) {
            return gulp.src('./templates/' + template_name + '.html')
                .pipe(replace('{{ page_name }}', capitalize(options.name)))
                .pipe(replace('{{ links }}', template_links()))
                .pipe(replace('{{ project_title }}', project_title))
                .pipe(replace('{{ theme_color }}', favicon_theme_color))
                .pipe(replace('{{ tile_color }}', favicon_tile_color))
                .pipe(replace('{{ css_file_name }}', css_file_name))
                .pipe(replace('{{ css_file_suffix }}', css_file_suffix))
                .pipe(replace('{{ js_file_name }}', js_file_name))
                .pipe(replace('{{ js_file_suffix }}', js_file_suffix))
                .pipe(rename(page_name))
                .pipe(gulp.dest('./' + dev_folder))
                .pipe(notify({ message: page_name + ' created', onLast: true }))
        } else {
            return gulp.src('/')
                .pipe(notify({ message: 'Error: ' + page_name + ' already exists', emitError: true }));
        }
    } else {
        return gulp.src('/')
            .pipe(notify({ message: 'Error: filename required', emitError: true }));
    }
};


/**
 * Create folders based on .env file variables
 */
const create_folders = (done) => {
    folders.forEach(dir => {
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });
    done();
};


/**
 * Zip the distribution folder
 */
const zip_assets = () => {
    return gulp.src(dist_folder + '/*')
        .pipe(zip(zip_file_name + '_' + timestamp() + '.zip'))
        .pipe(gulp.dest('./' + export_folder));
};





/**
 * @Command: gulp help
 *
 * List all of the available gulp commands
 */
const gulp_help = (done) => {
    console.log("\n\nThis is a list of all available tasks: \n");
    console.log(" (default) -  preform css and js processes");
    console.log(" setup     -  build folders based on .env file variables");
    console.log(" build     -  run all processes");
    console.log(" css       -  compile sass files, combine and minify all css files");
    console.log(" js        -  combine and minify all js files");
    console.log(" html      -  copy html files from " + dev_folder + " to " + dist_folder + " folder");
    console.log(" favicon   -  create favicons from " + dev_favicon_folder + "/" + favicon_name);
    console.log(" images    -  compress all images in " + dev_images_folder + " and save to " + dist_images_folder );
    console.log(" clean     -  delete all compiled files including exports");
    console.log(" watch     -  automatically compile when files are updated");
    console.log(" zip       -  create zip file from the "  + dist_folder + " folder called "  + zip_file_name + ".zip\n\n");
    done();
};


/**
 * @Command: gulp setup
 */
const gulp_setup = gulp.series(create_folders);


/**
 * @Command: gulp css
 */
const gulp_css = gulp.series(compile_sass, minify_css, delete_compiled_sass);


/**
 * @Command: gulp js
 */
const gulp_js = gulp.series(minify_js);


/**
 * @Command: gulp
 */
const gulp_default = gulp.parallel(gulp_css, gulp_js);


/**
 * @Command: gulp favicon
 */
const gulp_favicon = gulp.series(generate_favicon);


/**
 * @Command: gulp html
 */
const gulp_html = gulp.series(
    delete_copied_html,
    gulp.parallel(get_html_links, get_html_names),
    create_html_link_page,
    copy_html
);


/**
 * @Command: gulp images
 */
const gulp_images = gulp.series(delete_compressed_images, minify_images);


/**
 * @Command: gulp clean
 */
const gulp_clean = gulp.series(
    gulp.parallel(delete_compiled_sass, deleted_exports, delete_distribution_folders, delete_html_names),
    setup
);


/**
 * @Command: gulp test
 */
const gulp_test = () => {
    return gulp.src('./')
        .pipe(notify({ message: "Gulp is working", onLast: true }));
};


/**
 * @Command: gulp template --name FILENAME
 */
const gulp_template = gulp.series(create_template);


/**
 * @Command: gulp zip
 */
const gulp_zip = gulp.series(zip_assets);


/**
 * @Command: gulp build
 */
const gulp_build = gulp.series(
    gulp.parallel(delete_copied_html, delete_compressed_images),
    gulp.parallel(gulp_css, gulp_js, gulp_html, generate_favicon, minify_images)
);


/**
 * @Command: gulp watch
 */
const gulp_watch = () => {
    gulp.watch([
        './' + dev_sass_folder + '/*.scss',
        './' + dev_css_folder + '/*.css',
        '!./' + dev_css_folder + '/*.compiled.css'
    ], gulp_css);
    gulp.watch('./' + dev_js_folder + '/*.js', gulp_js);
    gulp.watch([
        './' + dev_folder + '/*.html',
        './templates/*.html'
    ], gulp.series(delete_cached_files, gulp_html));
    gulp.watch('./' + dev_images_folder + '/*', gulp_images);
    gulp.watch('./' + dev_favicon_folder + '/' + favicon_name, generate_favicon);
};





/**
 * ----- Gulp Commands -----
 */
exports.build = gulp_build;
exports.clean = gulp_clean;
exports.css = gulp_css;
exports.default = gulp_default;
exports.favicon = gulp_favicon;
exports.help = gulp_help;
exports.html = gulp_html;
exports.images = gulp_images;
exports.js = gulp_js;
exports.setup = gulp_setup;
exports.template = gulp_template;
exports.test = gulp_test;
exports.watch = gulp_watch;
exports.zip = gulp_zip;