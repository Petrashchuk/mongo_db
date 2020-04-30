const mongoose = require('mongoose');
const Feedbacks = mongoose.model('Feedbacks');
const Users = mongoose.model('Users');

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

    Feedbacks.aggregate([
        {
            $lookup: {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {"$unwind": "$user"},
    ]).facet({
        answer: [
            {
                $group: {
                    _id: '$value',
                    total: {$sum: 1}
                }
            }
        ],
        // books: [{ groupBy: '$author' }],
        // price: [{ $bucketAuto: { groupBy: '$price', buckets: 2 } }]
    })
        .then(res => {
            console.log(res);
        });
    // Feedbacks.aggregate([
    //     {
    //         $lookup: {
    //             "from": "Users",
    //             "localField": "userId",
    //             "foreignField": "_id",
    //             "as": "user"
    //         }
    //     }
    // ]).exec((err, result) => {
    //     console.log(result);
    // });


    // await Feedbacks.aggregate.lookup({from: 'Users', localField: 'userId', foreignField: '_id', as: 'users'})


    // const gender_counter = collection_users.aggregate([
    //     {$group: {_id: "$gender", total: {$sum: 1}}},
    // ]);
    // const values_counter = collection_feedbacks.aggregate([
    //     {$group: {_id: '$value', value: {$sum: 1}}}]);
    // console.log(gender_counter);
    // console.log(values_counter);
};
