# Asset Builder

- Compile scss files
- Combine and minimise all css files
- Combine and minimise all js files
- Generate favicon images
- Compress all images
- Create zip file of distribution folder


## Setup

This asset builder uses Gulp 4.0. Make sure you have the necessary versions of Node.js and NPM installed.

Run `npm install`

In the `.env` file, set you project variables. Below are the default settings:

```
# Project
#
PROJECT_TITLE = Asset Builder
ZIP_FILE_NAME = assets

FAVICON_IMAGE_NAME = favicon.png
FAVICON_TILE_COLOR = #ffffff
FAVICON_THEME_COLOR = #ffffff

CSS_FILE_NAME = app
CSS_FILE_NAME_SUFFIX = min

JS_FILE_NAME = app
JS_FILE_NAME_SUFFIX = min


# Development Folder Structure
#
DEVELOPMENT_FOLDER_NAME = development
DEVELOPMENT_CSS_FOLDER_NAME = css
DEVELOPMENT_FAVICON_FOLDER_NAME = favicon
DEVELOPMENT_FONTS_FOLDER_NAME = fonts
DEVELOPMENT_IMAGES_FOLDER_NAME = img
DEVELOPMENT_JS_FOLDER_NAME = js
DEVELOPMENT_SASS_FOLDER_NAME = sass


# Distribution FOlder Structure
#
DISTRIBUTION_FOLDER_NAME = public
DISTRIBUTION_CSS_FOLDER_NAME = css
DISTRIBUTION_FONTS_FOLDER_NAME = fonts
DISTRIBUTION_IMAGES_FOLDER_NAME = img
DISTRIBUTION_JS_FOLDER_NAME = js
```


Once completed run:
```
gulp setup
```
This will generate you folder structure. You can now add the necessary files to you development folders.


## Gulp Commands

The main gulp commands are:
- `gulp` - compile css, js and html files
- `gulp build` - will run all available processes (css, js, html, favicon, image compression)
- `gulp help` - will list all available commands
- `gulp setup` - create folder structure based on `.env` settings
- `gulp css` - compile sass, combine and minify css files, save to distribution folder
- `gulp js` - combine and minify css files, save to distribution folder
- `gulp html` - copy html from development to distribution
- `gulp favicon` - generate favicon files
- `gulp images` - compress all images and save to distribution folder
- `gulp zip` - zip distribution folder
- `gulp clean` - delete all compiled files


### favicon-data.json

This file is written to by the gulp response. It's included in the repo but the changes do not need to be tracked. If they are being tracked run

``` 
git update-index --assume-unchanged favicon-data.json
```
