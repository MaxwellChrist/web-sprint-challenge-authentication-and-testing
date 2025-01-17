const db = require('../../data/dbConfig')

function findUser(item) {
    return db('users').where(item)
}

function findUserById(id) {
    return db('users').where('id', id).first()
}

async function addUser(item) {
    return db('users').insert(item)
    .then(result => findUserById(result[0]));
}

module.exports = {
    findUser, findUserById, addUser
}