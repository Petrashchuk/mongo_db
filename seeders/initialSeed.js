const mongoose = require('mongoose');

module.exports = async function fillDB() {
    const Users = mongoose.model('users');
    const Feedbacks = mongoose.model('Feedbacks');
    const Ideas = mongoose.model('Ideas');

    const arrayOfUsers = await require('../helpers/randomizer');

    if (arrayOfUsers.length > 0) {
        const users = await fillUser(arrayOfUsers);
        const ideas = await fillIdeas(users);
        await fillFeedback(users, ideas);
    }
};

async function fillFeedback(users, ideas) {
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
    return Feedbacks.insertMany(feedback);
}

async function fillIdeas(users) {
    const randomUser = Math.floor(Math.random() * users.length);
    const description = "is it Cool?";
    console.log(users[randomUser]._id);
    const userId = users[randomUser]._id;
    return Ideas.insertOne({
        description,
        userId
    });
}

async function fillUser(users) {
    return Users.insertMany(users);
};
