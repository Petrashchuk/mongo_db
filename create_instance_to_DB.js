const feedback_Schema = require('./models/Feedbacks');
const user_Schema = require('./models/Users');
const ideas_Schema = require('./models/Ideas');

const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://petrashchuk_andrii:Vito9550@cluster0-fvywc.mongodb.net/DataBase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

function createConnection() {
    return new Promise(resolve => {
        client.connect().then(() => {
            client.db("DataBase").createCollection("users", user_Schema);
            client.db("DataBase").createCollection("ideas", ideas_Schema);
            client.db("DataBase").createCollection("feedbacks", feedback_Schema);
            resolve(client);
        });
    });
}

module.exports = createConnection;
