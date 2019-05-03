const fs = require('fs');
const parse = require('body-parser');
const express = require('express');
const { exec } = require('child_process');

const app = express();

let watching = false;

app.use(parse.json());
app.use(parse.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.listen(3000, function () {
    const args = process.argv.slice(2);
    if (!fs.existsSync('./names.json')) {
        fs.writeFile('./names.json', '[]', function (err) {
            if (err) throw err;
        });
    }
    exec('gulp setup');
    if(args[0] === "watch") {
        exec('gulp watch');
        watching = true;
        console.log('App listening at http://localhost:3001');
    }
    else {
        console.log('Example app listening at http://localhost:3000');
    }
});

app.post('/setup', function(req, res){
    res.json({
        'watching': watching
    });
});


app.post('/send', function(req, res){
    exec("gulp " + req.body.command, function() {
        res.json({success : "Task ran successfully", status : 200});
    });
});


app.post('/names', function(req, res){
    fs.readFile("./names.json", "utf8", function(err, data){
        res.json(JSON.parse(data));
    });
});


app.post('/create', function(req, res){
    if(req.body.command.length) {
        exec('gulp template --name "' + req.body.command + '"', function() {
            res.json({success : req.body.command + " page created", status : 200});
        });
    }
    else {
        res.json({error : " no page name given", status : 400});
    }
});