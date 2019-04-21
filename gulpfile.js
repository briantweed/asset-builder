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
 * -- Variables --
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
    dev_folder, dev_css_folder, dev_favicon_folder, dev_fonts_folder, dev_images_folder, dev_js_folder, dev_sass_folder,
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
    console.log("  clean      -  delete all compiled files including exports\n\n");
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
    // fs.writeFileSync('./src/favicon-data.json', '{}');
    done();
};


/**
 * Compile Sass files
 *
 * Compile each development sass file and save as FILENAME.compiled.css
 */
const compile_sass = () => {
    return gulp.src('./' + dev_sass_folder + '/**/*.scss')
        .pipe(sass({
            includePaths: ['node_modules']
        }))
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
 * Delete compiled sass files
 */
const delete_compiled_sass = () => {
    return del('./' + dev_css_folder + '/*compiled.css');
};


/**
 * @Command: gulp css
 *
 * Compile scss files, combine and minimise all css files, save to distribution folder
 */
const compile_css = gulp.series(compile_sass, minify_css, delete_compiled_sass);


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
 * @Command: gulp zip
 *
 * Zip the distribution folder
 */
const zip_assets = () => {
    return gulp.src(dist_folder + '/*')
        .pipe(zip(
            zip_file_name  + '_' +
            new Date().getFullYear() + '_' +
            (("0" + (new Date().getMonth() + 1)).slice(-2)) + '_' +
            (("0" + new Date().getDate()).slice(-2)) + '_' +
            (("0" + new Date().getHours()).slice(-2)) + '_' +
            (("0" + new Date().getMinutes()).slice(-2)) + '_' +
            (("0" + new Date().getSeconds()).slice(-2)) +
            '.zip'
        ))
        .pipe(gulp.dest('./' + export_folder));
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
 * @Command: gulp clean
 *
 * Delete all compiled files
 */
const clean = gulp.series(
    gulp.parallel(delete_compiled_sass, deleted_exports, delete_distribution_folders),
    setup
);


/**
 * @Command: gulp template --name filename
 *
 * @TODO - apply replace when template copied to distribution folder
 * Create an html file
 */
const template = () => {
    let options = minimist(process.argv.slice(3));
    if (options.name !== undefined && options.name !== true) {
        let page_name = options.name + '.html';
        if (!fs.existsSync('./' + dev_folder + '/' + page_name)) {
            return gulp.src('./templates/' + template_name + '.html')
                .pipe(replace('{{ page_name }}', capitalize(options.name)))
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
            return gulp.src('/').pipe(notify({ message: 'Error: ' + page_name + ' already exists', emitError: true }));
        }
    } else {
        return gulp.src('/').pipe(notify({ message: 'Error: filename required', emitError: true }));
    }
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
    return gulp.src('./' + dev_folder + '/*.html')
        .pipe(filelist('names.json', { flatten: true, removeExtensions: true }))
        .pipe(gulp.dest('./src'));
};


/**
 * Get the html file links
 */
const get_html_links = () => {
    return gulp.src('./' + dev_folder + '/*.html')
        .pipe(filelist('links.json', { flatten: true}))
        .pipe(gulp.dest('./src'));
};


/**
 * Create landing page with links to template files
 */
const create_html_link_page = (done) => {
    let links = require('./src/links.json');
    let names = require('./src/names.json');
    let string = "<ul>\n";
    for (let i = 0; i < links.length; i++) {
        string += "\t\t\t\t\t\t<li><a href='" + links[i] + "'>" + capitalize(names[i]) + "</a></li>\n";
    }
    string += "\t\t\t\t\t</ul>";
    gulp.src('./templates/index.html')
        .pipe(replace('{{ links }}', string))
        .pipe(replace('{{ project_title }}', project_title))
        .pipe(replace('{{ project_author }}', project_author))
        .pipe(gulp.dest(dist_folder));
    done();
};


/**
 * Copy html files from development to distribution
 */
const copy_html = () => {
    return gulp.src('./' + dev_folder + '/*.html').pipe(gulp.dest('./' + dist_folder));
};


/**
 * Delete files containing list of template names
 */
const delete_html_names = () => {
    return del(['./src/links.json', './src/names.json']);
};


/**
 * @Command: gulp html
 *
 * Copy html files from development to distribution
 * Create landing page with links to template files
 */
const compile_html = gulp.series( delete_copied_html, gulp.parallel(get_html_links ,get_html_names), gulp.parallel(create_html_link_page, copy_html), delete_html_names);


/**
 * @Command: gulp build
 *
 * Compile all assets
 */
const build = gulp.series(clean,
    gulp.parallel(compile_css, minify_js, compile_html, generate_favicon, minify_images)
);


/**
 * @Command: gulp
 *
 * Compile scss files, combine and minimise all css files
 * Combine and minimise all js files
 */
const css_and_js = gulp.parallel(compile_css, minify_js);


/**
 * @Command: gulp test
 */
const test = () => {
    return gulp.src('./').pipe(notify({ message: "Gulp is working", onLast: true }));
};


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
exports.html = compile_html;
exports.zip = zip_assets;
exports.clean = clean;
exports.test = test;
exports.template = template;





/**
 * -- Helper Function --
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
}