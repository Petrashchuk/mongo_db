const express = require('express');
const bodyParser = require('body-parser');
const createConnection = require('./create_instance_to_DB');
const fillDB =require('./seeders/initialSeed');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

createConnection()
    .then((client) => {
        fillDB(client)
    });


app.use(require('./routes'));

//todo run seed
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
