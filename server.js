const fs = require('fs');
const parse = require('body-parser');
const express = require('express');
const { exec } = require('child_process');

const app = express();

app.use(parse.json());
app.use(parse.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.listen(3000, function () {
    if (!fs.existsSync('./names.json')) {
        fs.writeFile('./names.json', '[]', function (err) {
            if (err) throw err;
            console.log('names.json created');
        });
    }
    exec('gulp setup');
    exec('gulp watch');
    console.log('server running on port 3000');
});


app.post('/send', function(req, res){
    exec('gulp ' + req.body.command, function() {
        res.json('{"success" : "Gulp ' + req.body.command + ' ran", "status" : 200}');
    });
});


app.post('/names', function(req, res){
    fs.readFile("./names.json", "utf8", function(err, data){
        res.send(data);
    });
});


app.post('/create', function(req, res){
    console.log(req.body.command);
    if(req.body.command.length) {
        exec('gulp template --name "' + req.body.command + '"', function() {
            res.json('{"success" : "File Created", "status" : 200}');
        });
    }
});