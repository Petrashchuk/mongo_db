const express = require('express');
const bodyParser = require('body-parser');
const createConnection = require('./create_instance_to_DB');
const usersArray = require('./helpers/randomizer');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

createConnection().then((client) => {
    // fillUser(client);
});

function fillUser(client) {
    client.db("DataBase").collection("users").find({}).count().then(usersCount => {
        if (usersCount && usersCount < 30000) {
            const notEnoughUser = 30000 - usersCount;
            const arr = [];
            for (let i = 0; i < notEnoughUser; i++) {
                let randomN = Math.floor(Math.random() * 30000);
                arr.push(usersArray[randomN])
            }
            client.db("DataBase").collection("users").insertMany(arr);

        } else if (!usersCount) {
            client.db("DataBase").collection("users").insertMany(usersArray);
        }
    });
}

app.use(require('./routes'));

//todo run seed
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
