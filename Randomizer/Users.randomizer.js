const names = ["John", "Joanne", "Bob", "Will", "Chris", "Mike", "Anna", "Jack", "Peter", "Paul"];
const nationality = ["Ukraine", "Russian", "Italia", "French", "Germany", "Japan", "China", "Croatia", "Spain", "Greece"];

const min = 20;
const max = 60;

let count = 30000;
const users = [];

while (count >= 10) {
    names.forEach((name, index) => {
        users.push({
            firstName: name,
            age: Math.floor(Math.random() * (max - min + 1)) + min,
            nationality: nationality[index],
        });

        count--
    })
}

module.exports = users;
