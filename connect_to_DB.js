const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://petrashchuk_andrii:Vito9550@cluster0-fvywc.mongodb.net/DataBase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true});

client.connect().then(async () => {
    const ideas = client.db("DataBase").createCollection("ideas");
    const feedbacks = client.db("DataBase").createCollection("feedbacks");
    const users = client.db("DataBase").createCollection("users");

    Promise.all([ideas, feedbacks, users]).then(res => {
        console.log(res);
    });
});
module.exports = client;
