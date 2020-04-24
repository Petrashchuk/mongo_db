
module.exports.remove_all_users = function (req, res) {
    const collection = MongoClient.db('DataBase').collection('users');
    collection.remove().then(res => {
        console.log(res);
    });
};
