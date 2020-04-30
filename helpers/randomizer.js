const mongoose = require('mongoose');
const names = ["John", "Marry", "Bob", "Christina", "Will", "Natali", "Jack", "Anna", "Peter", "Viktoria"];
const nationality = ["Ukraine", "Russian", "Italia", "French", "Germany", "Japan", "China", "Croatia", "Spain", "Greece"];
const gender = ['female', 'male'];
const ages_min = 20;
const ages_max = 60;

let count = 30000;

module.exports = new Promise(resolve => {
    const Users = mongoose.model('Users');

    Users.countDocuments({}, (err, users_count) => {
        resolve(createNecessaryUsers(users_count));
    });
});

function createNecessaryUsers(users_count) {
    const users = [];
    while (count > users_count) {
        users.push(new Users({
            name: getRandomName(),
            age: Math.floor(Math.random() * (ages_max - ages_min + 1)) + ages_min,
            nationality: getRandomNationality(),
            gender: randomGender()
        }));
        count--
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
