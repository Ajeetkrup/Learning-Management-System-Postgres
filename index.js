const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

const db = require('./config/postgres')

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', require('./routes'));


app.listen(
    port, 
    function(err){
        if(err){
            console.log(`The server is not running error: ${err}`);
        }
        else{
            console.log(`The server is up and running at port ${port}.`);
        }
    }
);
