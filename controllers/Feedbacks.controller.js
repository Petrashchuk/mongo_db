const MongoClient = require('../create_instance_to_DB');

let collection_feedbacks;
MongoClient().then(client => {
    collection_feedbacks = client.db('DataBase').collection('feedbacks');
});

module.exports.create_feedback = function (req, res) {
    collection_feedbacks.insertOne(req.body).then(response => {
        res.send(response)
    });
};
