const names = ["John", "Marry", "Bob", "Christina", "Will", "Natali", "Jack", "Anna", "Peter", "Viktoria"];
const nationality = ["Ukraine", "Russian", "Italia", "French", "Germany", "Japan", "China", "Croatia", "Spain", "Greece"];

const min = 20;
const max = 60;

let count = 30000;
const users = [];
//todo rename this directory to utils or helpers (lowercase)

//todo for loop
//todo add `gender` field => male | female
while (count >= 10) {
    names.forEach((name, index) => {
        users.push({
            firstName: name,
            age: Math.floor(Math.random() * (max - min + 1)) + min,
            nationality: nationality[index],
            gender: index % 2 === 0 ? 'male' : 'female'
        });
        count--
    })
}

//todo add function 'getRandomName(), randomGender(), getRandomNationality()'

module.exports = users;
