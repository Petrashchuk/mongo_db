const mongoose = require('mongoose');

async function fillFeedback(users, ideas) {
    const Feedbacks = mongoose.model('Feedbacks');
    const feedback = [], values = [true, false];
    for (let i = 0; i < users.length; i++) {
        const n = Math.floor(Math.random() * values.length);
        const userId = users[i]._id;
        const ideaId = ideas._id;
        feedback.push({userId, ideaId, value: values[n]});
    }
    return Feedbacks.insertMany(feedback);
}

async function fillIdeas(users, index) {
    const Ideas = mongoose.model('Ideas');

    const description = "is it Cool?", user_id = users[index]._id;
    const idea = new Ideas({
        description,
        user_id
    });
    return idea.save();
}

async function fillUser(users) {
    const Users = mongoose.model('Users');
    return Users.insertMany(users);
}

module.exports = async function fillDB() {
    const arrayOfUsers = await require('../helpers/randomizer');
    if (arrayOfUsers.length > 0) {
        const users = await fillUser(arrayOfUsers);
        const index = Math.floor(Math.random() * users.length);
        const ideas = await fillIdeas(users, index);
        users[index].ideas = ideas._id;
        await users[index].save();
        const feedback = await fillFeedback(users, ideas);
        ideas.feedbacks = feedback.map(item => item._id);
        await ideas.save();
    }
};
