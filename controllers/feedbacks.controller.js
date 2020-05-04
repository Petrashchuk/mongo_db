const mongoose = require('mongoose');
const Feedbacks = mongoose.model('Feedbacks');
const Users = mongoose.model('Users');

module.exports.create_feedback = function (req, res) {

};
module.exports.remove_feedbacks = function (req, res) {

};

module.exports.show_statistic = async function (req, res) {

    const response = await Feedbacks.aggregate([
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
        "yes": [
            {$match: {value: true}},
            {$group: {_id: "$user.gender", count: {$sum: 1}, avg_ages: {$avg: "$user.age"}}}

        ],
        "no": [
            {$match: {value: false}},
            {$group: {_id: "$user.gender", count: {$sum: 1}, avg_ages: {$avg: "$user.age"}}}
        ]
    });
    console.log(response);
};
