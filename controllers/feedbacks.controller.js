const mongoose = require('mongoose');
const Feedbacks = mongoose.model('Feedbacks');

module.exports.show_statistic = async function (req, res) {
    await Feedbacks.aggregate([
        {
            $lookup: {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {$unwind: "$user"},
    ]).facet({
            "yes": [
                {$match: {value: true}},
                {
                    $group: {
                        _id: {
                            GENDER: "$user.gender",
                            AGE: "$user.age",
                            COUNTRY: "$user.nationality"
                        },
                        count: {
                            "$sum": 1
                        }
                    }
                }, {
                    $group: {
                        _id: "$_id.GENDER",
                        AGES_GROUP: {
                            "$push": {
                                AGE_RANGE: {
                                    $concat: [
                                        {$cond: [{$and: [{$gte: ["$_id.AGE", 20]}, {$lt: ["$_id.AGE", 30]}]}, "20 - 29", ""]},
                                        {$cond: [{$and: [{$gte: ["$_id.AGE", 30]}, {$lt: ["$_id.AGE", 40]}]}, "30 - 39", ""]},
                                        {$cond: [{$and: [{$gte: ["$_id.AGE", 40]}, {$lt: ["$_id.AGE", 50]}]}, "40 - 49", ""]},
                                        {$cond: [{$and: [{$gte: ["$_id.AGE", 50]}, {$lt: ["$_id.AGE", 61]}]}, "50 - 60", ""]},
                                    ]
                                },
                                count: "$count"
                            }
                        },
                        COUNTRY_GROUP: {
                            "$push": {
                                COUNTRY: "$_id.COUNTRY",
                                count: "$count"
                            }
                        },
                        count: {$sum: "$count"}
                    }
                }
            ],
            "no": [
                {$match: {value: false}},
                {
                    $group: {
                        _id: {
                            GENDER: "$user.gender",
                            AGE: "$user.age",
                            COUNTRY: "$user.nationality"
                        },
                        count: {
                            "$sum": 1
                        }
                    }
                }, {
                    $group: {
                        _id: "$_id.GENDER",
                        AGES_GROUP: {
                            "$push": {
                                AGE_RANGE: {
                                    $concat: [
                                        {$cond: [{$and: [{$gte: ["$_id.AGE", 20]}, {$lt: ["$_id.AGE", 30]}]}, "20 - 29", ""]},
                                        {$cond: [{$and: [{$gte: ["$_id.AGE", 30]}, {$lt: ["$_id.AGE", 40]}]}, "30 - 39", ""]},
                                        {$cond: [{$and: [{$gte: ["$_id.AGE", 40]}, {$lt: ["$_id.AGE", 50]}]}, "40 - 49", ""]},
                                        {$cond: [{$and: [{$gte: ["$_id.AGE", 50]}, {$lt: ["$_id.AGE", 61]}]}, "50 - 60", ""]},
                                    ]
                                },
                                count: "$count"
                            }
                        },
                        COUNTRY_GROUP: {
                            "$push": {
                                COUNTRY: "$_id.COUNTRY",
                                count: "$count"
                            }
                        },
                        count: {$sum: "$count"}
                    }
                }
            ]
        }
    ).exec((err, result) => {
        if (err) return res.status(400).json(err);

        result.forEach(answers => {
            for (let answerKey in answers) {
                answers[answerKey].forEach(objByGender => {
                    objByGender.COUNTRY_GROUP = formatCountry(objByGender.COUNTRY_GROUP, 'COUNTRY');
                    objByGender.AGES_GROUP = formatCountry(objByGender.AGES_GROUP, 'AGE_RANGE');
                });
            }
        });

        res.status(200).json(result);
    });
};

const formatCountry = (arr, arrProp) => {
    let holder = {}, obj2 = [];
    arr.forEach((d) => {
        holder[d[arrProp]] = holder.hasOwnProperty(d[arrProp]) ? holder[d[arrProp]] + d.count : d.count;
    });
    for (let prop in holder) {
        obj2.push({[arrProp]: prop, count: holder[prop]});
    }
    return obj2;
};
