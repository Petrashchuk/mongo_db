const MongoClient = require('../create_instance_to_DB');
const userRandom = require('../helpers/randomizer');
let collection_users;
MongoClient().then(client => {
    collection_users = client.db('DataBase').collection('users');
});

module.exports.create_user = function (req, res) {
    // const {age, gender, nationality} = req.body;
    //todo initialize outside the function
    //todo rename collections => userCollections

    collection_users.insertOne(req.body).then(user => {
        res.send(user)
    }).catch(e=>{
        res.send(e)
    });
};

module.exports.remove_all_users = function (req, res) {
    //todo initialize outside the function
    //todo rename collections => userCollections
    collection_users.remove().then(response => {
        res.send(response);
    });
};
