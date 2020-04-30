
module.exports.create_user = function (req, res) {
    collection_users.insertOne(req.body).then(user => {
        res.send(user)
    }).catch(e => {
        res.send(e)
    });
};

module.exports.remove_all_users = function (req, res) {
    collection_users.deleteMany({}).then(response => {
        res.send(response);
    });
};
