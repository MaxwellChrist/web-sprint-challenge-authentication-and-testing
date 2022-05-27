const db = require('../../data/dbConfig')

function findUser(item) {
    return db('users').where(item)
}

function findUserById(id) {
    return db('users').where('id', id).first()
}

async function addUser(hobbit) {
    return db('users').insert(hobbit)
    .then(result => findUserById(result[0]));
}

module.exports = {
    findUser, findUserById, addUser
}