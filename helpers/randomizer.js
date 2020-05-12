const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const {names, nationality, ageRange, usersCount, gender} = require('./data');

module.exports = new Promise(resolve => {
    const Users = mongoose.model('Users');

    Users.countDocuments({}, (err, users_count) => {
        resolve(createNecessaryUsers(users_count));
    });
});

function createNecessaryUsers(users_count) {
    const users = [];
    while (usersCount > users_count) {
        users.push(new Users({
            name: getRandomName(),
            age: Math.floor(Math.random() * (ageRange[1] - ageRange[0] + 1)) + ageRange[0],
            nationality: getRandomNationality(),
            gender: randomGender()
        }));
        users_count--
    }
    return users;
}

function getRandomName() {
    return names[Math.floor((Math.random() * names.length))]
}

function getRandomNationality() {
    return nationality[Math.floor((Math.random() * nationality.length))]
}

function randomGender() {
    return gender[Math.floor((Math.random() * gender.length))]
}
