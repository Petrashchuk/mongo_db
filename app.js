const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('./routes'));

//todo run seed
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
