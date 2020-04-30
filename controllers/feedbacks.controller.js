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

module.exports.show_statistic = function (req, res) {
    const gender_counter = collection_users.aggregate([
        {$group: {_id: "$gender", total: {$sum: 1}}},
    ]);
    const values_counter = collection_feedbacks.aggregate([
        {$group: {_id: '$value', value:  {$sum: 1}}}]);
    console.log(gender_counter);
    console.log(values_counter);
};
