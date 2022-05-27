const { SECRET } = require('../../secret')
const jwt = require('jsonwebtoken')
const Users = require('../auth/auth-model')

module.exports = async (req, res, next) => {
  if (req.headers.authorization == null) {
    res.status(401).json({ message: "token required" })
  }

  try {
    req.checkToken = await jwt.verify(req.headers.authorization, SECRET);
    next()
  } catch(err) {
    res.status(401).json({ message: "token invalid" })
  }
}
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */