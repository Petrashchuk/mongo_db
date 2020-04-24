const MongoClient = require('../connect_to_DB');
const userRandom = require('../Randomizer/Users.randomizer');


module.exports.create_user = function (req, res) {
    // const {age, gender, nationality} = req.body;
    const collection = MongoClient.db('DataBase').collection('users');
    collection.insertMany(userRandom).then(res => {
        console.log(res);
    });
};

module.exports.remove_all_users = function (req, res) {
    const collection = MongoClient.db('DataBase').collection('users');
    collection.remove().then(res => {
        console.log(res);
    });
};
