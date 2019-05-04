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

Set your variable in the `.env` file. 

#### Automatic build process
`npm start` - will run the gulp setup and create a local server @ `localhost:3000`.
This will also create a user interface for running individual gulp commands, as well as links to each html page.

`npm start -- watch` - will watch for any changes to your development folder and update the browser automatically.


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


## Dev

The user interface is built using React. The main file can be found in `templates/react.jsx`
This file is then compiled using `babel` to `templates/react.js` and used for the interface.

The gulp command is `gulp babel`, should you want to make changes.
