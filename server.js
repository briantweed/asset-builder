const fs = require('fs');
const express = require('express');
const app = express();
const { exec } = require('child_process');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/send' , function(req , res){
    if(req.body.command.length) exec('gulp ' + req.body.command);
    console.log(req.body.command);
});

app.post('/create' , function(req , res){
    exec('gulp template --name ' + req.body.command);
    res.send('success!');

});

app.listen(3000, function () {
    exec('gulp setup');
    if (!fs.existsSync('./names.json')) {
        fs.writeFile('./names.json', '[]', function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }
    exec('gulp watch');
    console.log('Example app listening on port 3000!');
});