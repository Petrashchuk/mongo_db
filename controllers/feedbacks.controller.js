const mongoose = require('mongoose');
const fetch = require('node-fetch');
const Feedbacks = mongoose.model('Feedbacks');
const {ageRange} = require('../helpers/data');


module.exports.create_feedback = function (req, res) {

};

module.exports.remove_feedbacks = function (req, res) {

};

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
                        count: { $sum: "$count" }
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
                        count: { $sum: "$count" }
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


// const ages = Feedbacks.aggregate([
//     {
//         $lookup: {
//             "from": "users",
//             "localField": "userId",
//             "foreignField": "_id",
//             "as": "user"
//         }
//     },
//     {$unwind: "$user"},
// ]).facet({
//     "yes": [
//         {$match: {value: true}},
//         {
//             $project: {
//                 range: {
//                     $concat: [
//                         {$cond: [{$and: [{$gte: ["$user.age", 20]}, {$lt: ["$user.age", 30]}]}, "20 - 29", ""]},
//                         {$cond: [{$and: [{$gte: ["$user.age", 30]}, {$lt: ["$user.age", 40]}]}, "30 - 39", ""]},
//                         {$cond: [{$and: [{$gte: ["$user.age", 40]}, {$lt: ["$user.age", 50]}]}, "40 - 49", ""]},
//                         {$cond: [{$and: [{$gte: ["$user.age", 50]}, {$lt: ["$user.age", 61]}]}, "50 - 60", ""]},
//                     ]
//                 },
//                 userGender: "$user.gender"
//             }
//         },
//
//         {$group: {_id: {userGender: "$userGender", range: "$range"}, count: {$sum: 1}}},
//
//     ],
//     "no": [
//         {$match: {value: false}},
//         {
//             $project: {
//                 "range": {
//                     $concat: [
//                         {$cond: [{$and: [{$gte: ["$user.age", 20]}, {$lt: ["$user.age", 30]}]}, "20 - 29", ""]},
//                         {$cond: [{$and: [{$gte: ["$user.age", 30]}, {$lt: ["$user.age", 40]}]}, "30 - 39", ""]},
//                         {$cond: [{$and: [{$gte: ["$user.age", 40]}, {$lt: ["$user.age", 50]}]}, "40 - 49", ""]},
//                         {$cond: [{$and: [{$gte: ["$user.age", 50]}, {$lt: ["$user.age", 61]}]}, "50 - 60", ""]},
//                     ]
//                 },
//                 userGender: "$user.gender"
//             }
//         },
//
//         {$group: {_id: {userGender: "$userGender", range: "$range"}, count: {$sum: 1}}}
//
//     ]
// });
//
// const countries = Feedbacks.aggregate([
//     {
//         $lookup: {
//             "from": "users",
//             "localField": "userId",
//             "foreignField": "_id",
//             "as": "user"
//         }
//     },
//     {$unwind: "$user"},
// ]).facet({
//     "yes": [
//         {$match: {value: true}},
//         {
//             $group: {
//                 _id: {userGender: "$user.gender", userNationality: "$user.nationality"},
//                 count: {$sum: 1},
//             }
//         },
//     ],
//     "no": [
//         {$match: {value: false}},
//         {
//             $group: {
//                 _id: {userGender: "$user.gender", userNationality: "$user.nationality"},
//                 count: {$sum: 1},
//             }
//         },
//     ]
// });
//
// Promise.all([ages, countries]).then(response => {
//     const [ages, countries] = response;
//
//     /**
//      * Ages
//      */
//
//     const agesMaleYes = filterByGender(ages[0].yes, 'male');
//     const agesMaleNo = filterByGender(ages[0].no, 'male');
//     const agesFemaleYes = filterByGender(ages[0].yes, 'female');
//     const agesFemaleNo = filterByGender(ages[0].no, 'female');
//
//     const maleVoitedYes = voitedUsers(agesMaleYes);
//     const femaleVoitedYes = voitedUsers(agesFemaleYes);
//     const maleVoitedNo = voitedUsers(agesMaleNo);
//     const femaleVoitedNo = voitedUsers(agesFemaleNo);
//
//     ages[0].yes.forEach(item => {
//         if (item._id.userGender === 'female') {
//             item.percentage = parseFloat(countPercantage(femaleVoitedYes, item.count))
//         } else if (item._id.userGender === 'male') {
//             item.percentage = parseFloat(countPercantage(maleVoitedYes, item.count))
//         }
//     });
//
//     ages[0].no.forEach(item => {
//         if (item._id.userGender === 'female') {
//             item.percentage = parseFloat(countPercantage(femaleVoitedNo, item.count))
//         } else if (item._id.userGender === 'male') {
//             item._id.percentage = parseFloat(countPercantage(maleVoitedNo, item.count))
//         }
//     });
//     /**
//      * Countries
//      */
//     const usersVoitedNo = voitedUsers(countries[0].no);
//     const usersVoitedYes = voitedUsers(countries[0].yes);
//
//     const countriesVoitedMaleYes = filterByGender(countries[0].yes, 'male');
//     const countriesVoitedFemaleYes = filterByGender(countries[0].yes, 'female');
//     const countriesVoitedMaleNo = filterByGender(countries[0].no, 'male');
//     const countriesVoitedFemaleNo = filterByGender(countries[0].no, 'female');
//
//     const countriesMaleYes = countVoicebyGenderInCountries(countriesVoitedMaleYes, usersVoitedYes + usersVoitedNo);
//     const countriesFemaleYes = countVoicebyGenderInCountries(countriesVoitedFemaleYes, usersVoitedYes + usersVoitedNo);
//     const countriesMaleNo = countVoicebyGenderInCountries(countriesVoitedMaleNo, usersVoitedYes + usersVoitedNo);
//     const countriesFemaleNo = countVoicebyGenderInCountries(countriesVoitedFemaleNo, usersVoitedYes + usersVoitedNo);
//
//     let statistic = {
//         yes: {
//             male: {
//                 sum: countriesVoitedMaleYes.reduce((c, item) => c + item.count, 0),
//                 countries: countriesMaleYes,
//                 ages: agesMaleYes
//             },
//             female: {
//                 sum: countriesVoitedFemaleYes.reduce((c, item) => c + item.count, 0),
//                 countries: countriesFemaleYes,
//                 ages: agesFemaleYes
//             }
//         },
//         no: {
//             male: {
//                 sum: countriesVoitedMaleNo.reduce((c, item) => c + item.count, 0),
//                 countries: countriesMaleNo,
//                 ages: agesMaleNo
//             },
//             female: {
//                 sum: countriesVoitedFemaleNo.reduce((c, item) => c + item.count, 0),
//                 countries: countriesFemaleNo,
//                 ages: agesFemaleNo
//             }
//         }
//     };
//     res.json(statistic)
//
//
// })
};

formatCountry = (arr, arrProp) => {
    let holder = {}, obj2 = [];
    arr.forEach((d) => {
        holder[d[arrProp]] = holder.hasOwnProperty(d[arrProp]) ? holder[d[arrProp]] + d.count : d.count;
    });
    for (let prop in holder) {
        obj2.push({[arrProp]: prop, count: holder[prop]});
    }
    return obj2;
};

function countPercantage(allusers, eachCountryUser) {
    const onePercentage = allusers / 100;
    return (eachCountryUser / onePercentage).toFixed(2)
}

function voitedUsers(array) {
    return array.reduce((c, item) => c + item.count, 0)
}

function filterByGender(array, gender) {
    return array.filter(item => {
        if (item._id.userGender === gender) {
            return item
        }
    });
}

function countVoicebyGenderInCountries(array, allUsersVoice) {
    return array.map(item => {
        return {
            name: item._id.userNationality,
            percentage: parseFloat(countPercantage(allUsersVoice, item.count))

        };
    })
}

getRanges = (ageRange) => {
    let arr = [];
    for (let i = ageRange[0]; i <= ageRange[1]; i += 10) {
        if (i === ageRange[0]) arr.push(i);
        else arr.push(i + 1);
    }
    return arr;
};

formatRangeAges = (answers) => {
    for (let answerKey in answers) {
        let answerSum = 0;
        answers[answerKey].forEach((item, index, self) => {
            if (index === self.length - 1) item.ageRange = item._id + '-' + ageRange[ageRange.length - 1];
            else item.ageRange = item._id + '-' + (self[index + 1]._id - 1).toString(10);
            delete item._id;
            answerSum += item.genderTotal;

        });
        answers[answerKey].sum = answerSum;
    }
    return answers;
};
