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
                    range: {
                        $concat: [
                            {$cond: [{$and: [{$gte: ["$user.age", 20]}, {$lt: ["$user.age", 30]}]}, "20 - 29", ""]},
                            {$cond: [{$and: [{$gte: ["$user.age", 30]}, {$lt: ["$user.age", 40]}]}, "30 - 39", ""]},
                            {$cond: [{$and: [{$gte: ["$user.age", 40]}, {$lt: ["$user.age", 50]}]}, "40 - 49", ""]},
                            {$cond: [{$and: [{$gte: ["$user.age", 50]}, {$lt: ["$user.age", 61]}]}, "50 - 60", ""]},
                        ]
                    },
                    userGender: "$user.gender"

                }
            },

            {$group: {_id: {userGender: "$userGender", range: "$range"}, count: {$sum: 1}}},


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
                },
                userGender: "$user.gender"
            }
        },
            {$group: {_id: {userGender: "$userGender", range: "$range"}, count: {$sum: 1}}},
        ]
    });

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

        // {
        //     $group: {
        //         _id: "$_id.userNationality",
        //         count_users: {$sum: '$count_users'},
        //         avg_ages: {$avg: "$avg_ages"},
        //     }
        // },
    ]).facet({
        "yes": [
            {$match: {value: true}},
            {
                $group: {
                    _id: {userGender: "$user.gender", userNationality: "$user.nationality"},
                    count: {$sum: 1},
                }
            },
        ],
        "no": [
            {$match: {value: false}},
            {
                $group: {
                    _id: {userGender: "$user.gender", userNationality: "$user.nationality"},
                    count: {$sum: 1},
                }
            },
        ]
    });

    Promise.all([ages, countries]).then(response => {
        const [ages, countries] = response;

        /**
         * Ages
         */

        const agesMaleYes = filterByGender(ages[0].yes, 'male');
        const agesMaleNo = filterByGender(ages[0].no, 'male');
        const agesFemaleYes = filterByGender(ages[0].yes, 'female');
        const agesFemaleNo = filterByGender(ages[0].no, 'female');

        const maleVoitedYes = voitedUsers(agesMaleYes);
        const femaleVoitedYes = voitedUsers(agesFemaleYes);
        const maleVoitedNo = voitedUsers(agesMaleNo);
        const femaleVoitedNo = voitedUsers(agesFemaleNo);

        ages[0].yes.forEach(item => {
            if (item._id.userGender === 'female') {
                item.percentage = parseFloat(countPercantage(femaleVoitedYes, item.count))
            } else if (item._id.userGender === 'male') {
                item.percentage = parseFloat(countPercantage(maleVoitedYes, item.count))
            }
        });

        ages[0].no.forEach(item => {
            if (item._id.userGender === 'female') {
                item.percentage = parseFloat(countPercantage(femaleVoitedNo, item.count))
            } else if (item._id.userGender === 'male') {
                item._id.percentage = parseFloat(countPercantage(maleVoitedNo, item.count))
            }
        });
        /**
         * Countries
         */
        const usersVoitedNo = voitedUsers(countries[0].no);
        const usersVoitedYes = voitedUsers(countries[0].yes);

        const countriesVoitedMaleYes = filterByGender(countries[0].yes, 'male');
        const countriesVoitedFemaleYes = filterByGender(countries[0].yes, 'female');
        const countriesVoitedMaleNo = filterByGender(countries[0].no, 'male');
        const countriesVoitedFemaleNo = filterByGender(countries[0].no, 'female');

        const countriesMaleYes = countVoicebyGenderInCountries(countriesVoitedMaleYes, usersVoitedYes + usersVoitedNo);
        const countriesFemaleYes = countVoicebyGenderInCountries(countriesVoitedFemaleYes, usersVoitedYes + usersVoitedNo);
        const countriesMaleNo = countVoicebyGenderInCountries(countriesVoitedMaleNo, usersVoitedYes + usersVoitedNo);
        const countriesFemaleNo = countVoicebyGenderInCountries(countriesVoitedFemaleNo, usersVoitedYes + usersVoitedNo);

        let statistic = {
            yes: {
                male: {
                    sum: countriesVoitedMaleYes.reduce((c, item) => c + item.count, 0),
                    countries: countriesMaleYes,
                    ages: agesMaleYes
                },
                female: {
                    sum: countriesVoitedFemaleYes.reduce((c, item) => c + item.count, 0),
                    countries: countriesFemaleYes,
                    ages: agesFemaleYes
                }
            },
            no: {
                male: {
                    sum: countriesVoitedMaleNo.reduce((c, item) => c + item.count, 0),
                    countries: countriesMaleNo,
                    ages: agesMaleNo
                },
                female: {
                    sum: countriesVoitedFemaleNo.reduce((c, item) => c + item.count, 0),
                    countries: countriesFemaleNo,
                    ages: agesFemaleNo
                }
            }
        };
        res.json(statistic)


    })
};

function calculatePercentagebyAges(array) {

}

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
