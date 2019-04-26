const express = require('express');
const app = express();
const { exec } = require('child_process');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/send' , function(req , res){
    console.log(req.body.command);
    exec('gulp ' + req.body.command);
    console.log('running gulp build');
    res.send('success!');

});

app.listen(3000, function () {
    exec('gulp watch');
    console.log('Example app listening on port 3000!');
});