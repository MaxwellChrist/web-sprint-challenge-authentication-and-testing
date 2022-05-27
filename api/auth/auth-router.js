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
});

router.post('/login', missingUsernameOrPassword, usernameExistsOrPasswordInvalid, (req, res) => {

  let { username, password } = req.body
  Users.findUser({username})
    .then(([result]) => {
      if(result && bcrypt.compareSync(password, result.password)) {
        const token = generateToken(result)
        res.json({ message: `welcome, ${result.username}`, token })
      } else {
        res.status(401).json({ message: "invalid credentials" })
      }
    })
  })

function generateToken(result) {
  const payload = {
    subject: result.id,
    username: result.username
  }
  const options = { expiresIn: '1d' }
  return jwt.sign(payload, SECRET, options)
}

module.exports = router;