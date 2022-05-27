const Users = require('../auth/auth-model')

const missingUsernameOrPassword = (req, res, next) => {
  let {username, password} = req.body
    if (
      username == null || username.trim() === "" ||
      password == null || password.trim() === ""
    ) {
      res.status(400).json({ message: "username and password required" })
    } else {
      next()
    }
  }

module.exports = missingUsernameOrPassword