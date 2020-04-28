const names = ["John", "Marry", "Bob", "Christina", "Will", "Natali", "Jack", "Anna", "Peter", "Viktoria"];
const nationality = ["Ukraine", "Russian", "Italia", "French", "Germany", "Japan", "China", "Croatia", "Spain", "Greece"];
const gender = ['female', 'male'];
const ages_min = 20;
const ages_max = 60;

let count = 30000;
const users = [];

function fillUsers() {
    while (count > 0) {
        users.push({
            firstName: getRandomName(),
            age: Math.floor(Math.random() * (ages_max - ages_min + 1)) + ages_min,
            nationality: getRandomNationality(),
            gender: randomGender()
        });
        count--
    }

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

fillUsers();

module.exports = users;
