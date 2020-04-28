const MongoClient = require('../create_instance_to_DB');


const names = ["John", "Marry", "Bob", "Christina", "Will", "Natali", "Jack", "Anna", "Peter", "Viktoria"];
const nationality = ["Ukraine", "Russian", "Italia", "French", "Germany", "Japan", "China", "Croatia", "Spain", "Greece"];
const gender = ['female', 'male'];
const ages_min = 20;
const ages_max = 60;

let count = 30000;


function arrayUsers(users_count) {
    const users = [];
    while (count > users_count) {
        users.push({
            firstName: getRandomName(),
            age: Math.floor(Math.random() * (ages_max - ages_min + 1)) + ages_min,
            nationality: getRandomNationality(),
            gender: randomGender()
        });
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


module.exports = new Promise(function (resolve, reject) {
    MongoClient().then(async (client) => {
        let count_user = await client.db('DataBase').collection('users').find({}).count();
        resolve(arrayUsers(count_user));
    });
});
