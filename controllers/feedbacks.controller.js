const MongoClient = require('../create_instance_to_DB');

let collection_feedbacks;
MongoClient().then(client => {
    collection_feedbacks = client.db('DataBase').collection('feedbacks');
    collection_ideas = client.db('DataBase').collection('ideas');

});

module.exports.create_feedback = function (req, res) {
    collection_feedbacks.insertOne(req.body).then(response => {
        res.send(response)
    });
};
module.exports.remove_feedbacks = function (req, res) {
    collection_feedbacks.deleteMany({}).then(response => {
        res.send(response);
    });
};

module.exports.show_statistic = async function (req, res) {
    const cursor = await collection_feedbacks.find({});

    await collection_ideas.aggregate([{$match:{ _id:"id"}}]).toArray((err, result) => {
        console.log(result);
    });
};
