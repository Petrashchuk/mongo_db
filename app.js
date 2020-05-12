const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const fillDB = require('./seeders/initialSeed');

mongoose.promise = global.Promise;

const uri = "mongodb+srv://petrashchuk_andrii:Vito9550@cluster0-fvywc.mongodb.net/DataBase?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
mongoose.set('debug', true);

require('./models/Users');
require('./models/Ideas');
require('./models/Feedbacks');

const app = express();
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));

fillDB();


//todo run seed
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
