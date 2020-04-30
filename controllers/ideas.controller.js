
module.exports.create_idea = function (req, res) {
    collection_ideas.insertOne(req.body).then(response => {
        res.send(response)
    }).catch(e => {
        res.send(e)
    })
};
