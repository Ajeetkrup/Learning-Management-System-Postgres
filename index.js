const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

const db = require('./config/postgres')

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', require('./routes'));

console.log('Host: ', process.env.PG_HOST);


app.listen(
    port, 
    function(err){
        if(err){
            console.log(`The server is not running error: ${err}`);
        }
        else{
            console.log(`The server is up and running at port ${port}.`);
            console.log('Host: ', process.env.PG_HOST);
        }
    }
);
