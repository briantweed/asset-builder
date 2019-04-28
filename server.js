const fs = require('fs');
const express = require('express');
const app = express();
const { exec } = require('child_process');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/send' , function(req , res){
    if(req.body.command.length) exec('gulp ' + req.body.command);
    console.log(req.body.command);
});

app.post('/create' , function(req , res){
    exec('gulp template --name ' + req.body.command, function() {
        res.json('{"success" : "Updated Successfully", "status" : 200}');
    });
});

app.listen(3000, function () {
    exec('gulp setup', function() {
        console.log('gulp setup');
    });
    if (!fs.existsSync('./names.json')) {
        fs.writeFile('./names.json', '[]', function (err) {
            if (err) throw err;
            console.log('names.json created');
        });
    }
    exec('gulp watch', function() {
        console.log('browsersync running on port 3001');
    });
    console.log('server running on port 3000');
});