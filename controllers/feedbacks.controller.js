const mongoose = require('mongoose');
const Feedbacks = mongoose.model('Feedbacks');
const Users = mongoose.model('Users');

module.exports.create_feedback = function (req, res) {

};
module.exports.remove_feedbacks = function (req, res) {

};

module.exports.show_statistic = async function (req, res) {

    const ages = Feedbacks.aggregate([
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
                $project: {
                    "range": {
                        $concat: [
                            {$cond: [{$and: [{$gte: ["$user.age", 20]}, {$lt: ["$user.age", 30]}]}, "20 - 29", ""]},
                            {$cond: [{$and: [{$gte: ["$user.age", 30]}, {$lt: ["$user.age", 40]}]}, "30 - 39", ""]},
                            {$cond: [{$and: [{$gte: ["$user.age", 40]}, {$lt: ["$user.age", 50]}]}, "40 - 49", ""]},
                            {$cond: [{$and: [{$gte: ["$user.age", 50]}, {$lt: ["$user.age", 61]}]}, "50 - 60", ""]},
                        ]
                    },
                }
            },

            {
                $group: {
                    _id: "$range",
                    count: {
                        $sum: 1
                    },
                },
            },

        ],
        "no": [{$match: {value: false}}, {
            $project: {
                "range": {
                    $concat: [
                        {$cond: [{$and: [{$gte: ["$user.age", 20]}, {$lt: ["$user.age", 30]}]}, "20 - 29", ""]},
                        {$cond: [{$and: [{$gte: ["$user.age", 30]}, {$lt: ["$user.age", 40]}]}, "30 - 39", ""]},
                        {$cond: [{$and: [{$gte: ["$user.age", 40]}, {$lt: ["$user.age", 50]}]}, "40 - 49", ""]},
                        {$cond: [{$and: [{$gte: ["$user.age", 50]}, {$lt: ["$user.age", 61]}]}, "50 - 60", ""]},
                    ]
                }
            }
        },
            {$group: {_id: "$range", count: {$sum: 1}}},
        ]
    });
    console.log(ages);

    const countries = Feedbacks.aggregate([
        {
            $lookup: {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {$unwind: "$user"},
        {
            $group: {
                _id: {userGender: "$user.gender", userNationality: "$user.nationality"},
                count_users: {$sum: 1},
                // ages: {$push: "$user.age"},
                // "ages": {$range: [0, "$user.age", 10]}
                // probabilityArr: {$push: {count: {$sum: 1}}}
            }
        },

        // {
        //     $group: {
        //         _id: "$_id.userNationality",
        //         count_users: {$sum: '$count_users'},
        //         avg_ages: {$avg: "$avg_ages"},
        //     }
        // },
    ]);

    Promise.all([ages, countries]).then(response => {
        const [ages, countries] = response;
        ages.flat();
        console.log(ages);
        console.log(response);
    })


    // const usersVoitedYes = voitedUsers(await response[0].yes);
    // const usersVoitedNo = voitedUsers(await response[0].no);
    //
    // const countriesVoitedMaleYes = filterByGender(response[0].yes, 'male');
    // const countriesVoitedFemaleYes = filterByGender(response[0].yes, 'female');
    // const countriesVoitedMaleNo = filterByGender(response[0].no, 'male');
    // const countriesVoitedFemaleNo = filterByGender(response[0].no, 'female');
    //
    // const countriesMaleYes = countVoicebyGenderInCountries(countriesVoitedMaleYes, usersVoitedYes + usersVoitedNo);
    // const countriesFemaleYes = countVoicebyGenderInCountries(countriesVoitedFemaleYes, usersVoitedYes + usersVoitedNo);
    // const countriesMaleNo = countVoicebyGenderInCountries(countriesVoitedMaleNo, usersVoitedYes + usersVoitedNo);
    // const countriesFemaleNo = countVoicebyGenderInCountries(countriesVoitedFemaleNo, usersVoitedYes + usersVoitedNo);
    //
    //
    // let obj = {
    //     yes: {
    //         male: {
    //             sum: countriesVoitedMaleYes.reduce((c, item) => c + item.count_users, 0),
    //             countries: countriesMaleYes,
    //             // ages:
    //         },
    //         female: {
    //             sum: countriesVoitedFemaleYes.reduce((c, item) => c + item.count_users, 0),
    //             countries: countriesFemaleYes
    //         }
    //     },
    //     no: {
    //         male: {
    //             sum: countriesVoitedMaleNo.reduce((c, item) => c + item.count_users, 0),
    //             countries: countriesMaleNo
    //         },
    //         female: {
    //             sum: countriesVoitedFemaleNo.reduce((c, item) => c + item.count_users, 0),
    //             countries: countriesFemaleNo
    //         }
    //     }
    // };
    // console.log(obj);
};


function countPercantage(allusers, eachCountryUser) {
    const onePercentage = allusers / 100;
    return (eachCountryUser / onePercentage).toFixed(2)
}

function voitedUsers(array) {
    return array.reduce((c, item) => c + item.count_users, 0)
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
            percentage: parseFloat(countPercantage(allUsersVoice, item.count_users))

        };
    })
}
