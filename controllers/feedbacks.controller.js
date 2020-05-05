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
            {
                $group: {
                    _id: {userGender: "$user.gender", userNationality: "$user.nationality"},
                    avg_ages: {$avg: "$user.age"},
                    count_users: {$sum: 1},
                    // probabilityArr: {$push: {count: {$sum: 1}}}
                }
            },
            {
                $group: {
                    _id: "$_id.userNationality",
                    count_users: {$sum: '$count_users'},
                    avg_ages: {$avg: "$avg_ages"},
                }
            },

        ],
        "no": [
            {$match: {value: false}},
            {
                $group: {
                    _id: {userGender: "$user.gender", userNationality: "$user.nationality"},
                    avg_ages: {$avg: "$user.age"},
                    count_users: {$sum: 1},
                    // probabilityArr: {$push: {count: {$sum: 1}}}
                }
            },
            {
                $group: {
                    _id: "$_id.userNationality",
                    count_users: {$sum: '$count_users'},
                    avg_ages: {$avg: "$avg_ages"},
                }
            },
        ]
    });
    const usersVoitedYes = await response[0].yes.reduce((c, item) => c + item.count_users, 0);
    const usersVoitedNo = await response[0].no.reduce((c, item) => c + item.count_users, 0);

    const countriesVoitedMaleYes = response[0].yes.filter(item => {
        if (item._id.userGender === 'male') {
            return item
        }
    });
    const countriesMaleYes = countriesVoitedMaleYes.map(item => {
        return {
            name: item._id.userNationality,
            percentage: parseFloat(countPercantage(usersVoitedYes + usersVoitedNo, item.count_users))
        }
    });
    const countriesVoitedFemaleYes = response[0].yes.filter((item, index, arr) => {
        if (item._id.userGender === 'female') {
            return item
        }
    });
    const countriesFemaleYes = countriesVoitedFemaleYes.map(item => {
        return {
            name: item._id.userNationality,
            percentage: parseFloat(countPercantage(usersVoitedYes + usersVoitedNo, item.count_users))
        }
    });

    const countriesVoitedMaleNo = response[0].no.filter((item, index, arr) => {
        if (item._id.userGender === 'male') {
            return item
        }
    });
    const countriesMaleNo = countriesVoitedMaleNo.map(item => {
        return {
            name: item._id.userNationality,
            percentage: parseFloat(countPercantage(usersVoitedYes + usersVoitedNo, item.count_users))
        }
    });
    const countriesVoitedFemaleNo = response[0].no.filter((item, index, arr) => {
        if (item._id.userGender === 'female') {
            return item
        }
    });
    const countriesFemaleNo = countriesVoitedFemaleNo.map(item => {
        return {
            name: item._id.userNationality,
            percentage: parseFloat(countPercantage(usersVoitedYes + usersVoitedNo, item.count_users))
        }
    });

    let obj = {
        yes: {
            male: {
                sum: countriesVoitedMaleYes.reduce((c, item) => c + item.count_users, 0),
                countries: countriesMaleYes
            },
            female: {
                sum: countriesVoitedFemaleYes.reduce((c, item) => c + item.count_users, 0),
                countries: countriesFemaleYes
            }
        },
        no: {
            male: {
                sum: countriesVoitedMaleNo.reduce((c, item) => c + item.count_users, 0),
                countries: countriesMaleNo
            },
            female: {
                sum: countriesVoitedFemaleNo.reduce((c, item) => c + item.count_users, 0),
                countries: countriesFemaleNo
            }
        }
    };
    console.log(obj);
};


function countPercantage(allusers, eachCountryUser) {
    const onePercentage = allusers / 100;
    return (eachCountryUser / onePercentage).toFixed(2)
}
