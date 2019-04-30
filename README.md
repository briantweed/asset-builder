# Asset Builder

- Compile scss files
- Combine and minimise all css files
- Combine and minimise all js files
- Generate favicon images
- Compress all images
- Create html templates
- Create zip file of distribution folder

## Setup

This asset builder uses Gulp 4.0. Make sure you have the necessary versions of Node.js and NPM installed.

Clone or download this repositiory locally to a new folder.

Run `npm install`

Set you variable names in the `.env` file. Below are the default settings:

```

# Project
PROJECT_TITLE = Asset Builder
ZIP_FILE_NAME = asset_builder

FAVICON_IMAGE_NAME = favicon.jpg
FAVICON_TILE_COLOR = #123456
FAVICON_THEME_COLOR = #987654

CSS_FILE_NAME = app
CSS_FILE_NAME_SUFFIX = min

JS_FILE_NAME = app
JS_FILE_NAME_SUFFIX = min

EXPORT_FOLDER_NAME = exports


# Development Folder Structure:
#
# |-- development
#   |-- css
#   |-- favicon
#   |-- fonts
#   |-- img
#   |-- js
#   |-- sass

DEVELOPMENT_FOLDER_NAME = resources
DEVELOPMENT_CSS_FOLDER_NAME = css
DEVELOPMENT_FAVICON_FOLDER_NAME = favicon
DEVELOPMENT_FONTS_FOLDER_NAME = fonts
DEVELOPMENT_IMAGES_FOLDER_NAME = img
DEVELOPMENT_JS_FOLDER_NAME = js
DEVELOPMENT_SASS_FOLDER_NAME = sass


# Distribution Folder Structure:
#
# |-- public
#   |-- css
#   |-- fonts
#   |-- img
#   |-- js

DISTRIBUTION_FOLDER_NAME = public
DISTRIBUTION_CSS_FOLDER_NAME = css
DISTRIBUTION_FONTS_FOLDER_NAME = fonts
DISTRIBUTION_IMAGES_FOLDER_NAME = img
DISTRIBUTION_JS_FOLDER_NAME = js
```


#### Automatic build process
`npm start` - will run the gulp setup, create a local server, watch for any changes to your development folder and update the browser.
This will also create a user interface for running individual gulp commands, as well as links to each html page.

#### Manually
`gulp setup`. You can compile file changes automatically by running `gulp watch` or manually using one of the following commands:

- `gulp` - compile css, js and html files
- `gulp build` - will run all available processes (css, js, html, favicon, image compression)
- `gulp help` - will list all available commands
- `gulp setup` - create folder structure based on `.env` settings
- `gulp css` - compile sass, combine and minify css files, save to distribution folder
- `gulp js` - combine and minify css files, save to distribution folder
- `gulp html` - copy html from development to distribution, creates page containing links to html pages
- `gulp fonts` - copy fonts from development to distribution
- `gulp template --name FILENAME` - create a new html file
- `gulp favicon` - generate favicon files
- `gulp images` - compress all images and save to distribution folder
- `gulp zip` - zip distribution folder and save to export folder
- `gulp clean` - delete all compiled files

