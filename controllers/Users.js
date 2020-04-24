const MongoClient = require('../connect_to_DB');
const userRandom = require('../Randomizer/Users.randomizer');

module.exports.create_user = function (req, res) {
    // const {age, gender, nationality} = req.body;
    //todo initialize outside the function
    const collection = MongoClient.db('DataBase').collection('users');
    //todo rename collections => userCollections

    collection.insertMany(userRandom).then(res => {
        console.log(res);
    });
};

module.exports.remove_all_users = function (req, res) {
    //todo initialize outside the function
    const collection = MongoClient.db('DataBase').collection('users');
    //todo rename collections => userCollections
    collection.remove().then(res => {
        console.log(res);
    });
};
