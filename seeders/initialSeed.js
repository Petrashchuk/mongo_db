const usersArray = require('../helpers/randomizer');


async function fillFeedback(client, users, ideas) {
    const feedback = [];
    const values = ['yes', 'no'];
    for (let i = 0; i < users.ops.length; i++) {
        const n = Math.floor(Math.random() * values.length);
        const userId = users.ops[i]._id.toHexString();
        const ideaId = ideas.ops[0]._id.toHexString();
        feedback.push({
            userId,
            ideaId,
            value: values[n]
        });
    }
    return client.db("DataBase").collection("feedbacks").insertMany(feedback);
}

async function fillIdeas(client, users) {
    const randomUser = Math.floor(Math.random() * users.ops.length);
    const description = "is it Cool?";
    const userId = users.ops[randomUser]._id.toHexString();
    return client.db("DataBase").collection("ideas").insertOne({
        description,
        userId
    })
}

async function fillUser(client) {
    const users = await usersArray();
    return client.db("DataBase").collection("users").insertMany(users);
};

module.exports = async function fillDB(client) {
    const users = await fillUser(client);
    const ideas = await fillIdeas(client, users);
    const feedbacks = await fillFeedback(client, users, ideas);
};
