const express = require('express');
const app = express();
const { exec } = require('child_process');


app.use(express.static('public'));

app.post('/send' , function(req , res){
    exec('gulp build');
    res.send('success!');

});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});