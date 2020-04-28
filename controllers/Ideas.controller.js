const MongoClient = require('../create_instance_to_DB');

let collection_ideas;
MongoClient().then(client => {
    collection_ideas = client.db('DataBase').collection('ideas');
});


module.exports.create_idea = function (req, res) {
    collection_ideas.insertOne(req.body).then(response => {
        res.send(response)
    }).catch(e => {
        res.send(e)
    })
};
