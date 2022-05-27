const router = require('express').Router();
const restricted = require('../middleware/restricted')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('./auth-model')
const { SECRET } = require('../../secret')
const missingUsernameOrPassword = require('../middleware/missingUsernameOrPassword')
const alreadyTakeUsername = require('../middleware/alreadyTakeUsername')
const usernameExistsOrPasswordInvalid = require('../middleware/usernameExistsOrPasswordInvalid')

router.post('/register', missingUsernameOrPassword, alreadyTakeUsername, (req, res) => {
  let result = req.body;
  const hashed = bcrypt.hashSync(req.body.password, 8);
  result.password = hashed
  Users.addUser(result)
  .then(resultSuccess => {
    res.json(resultSuccess)
  })
  .catch(err => {
    res.status(500).json({ message: "Cannot register at this time" })
  })

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', missingUsernameOrPassword, usernameExistsOrPasswordInvalid, (req, res) => {

  let { username, password } = req.body
  Users.findUser({username})
    .then(([result]) => {
      // console.log(result)
      if(result && bcrypt.compareSync(password, result.password)) {
        const token = generateToken(result)
        res.json({ message: `welcome, ${result.username}`, token })
      } else {
        res.status(400).json({ message: "invalid credentials" })
        // 4- On FAILED login due to `password` being incorrect,
        // the response body should include a string exactly as follows: "invalid credentials".
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Cannot login at this time" })
    })
  })

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

function generateToken(result) {
  const payload = {
    subject: result.id,
    username: result.username
  }
  const options = { expiresIn: '1d' }
  return jwt.sign(payload, SECRET, options)
}

module.exports = router;