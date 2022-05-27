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
    // 3- On FAILED registration due to `username` or `password` missing from the request body,
    // the response body should include a string exactly as follows: "username and password required".
  }

module.exports = missingUsernameOrPassword