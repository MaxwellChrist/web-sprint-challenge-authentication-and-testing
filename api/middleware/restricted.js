const { SECRET } = require('../../secret')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  if (req.headers.authorization == null) {
    res.status(401).json({ message: "token required" })
    return
  }
  try {
    req.checkToken = await jwt.verify(req.headers.authorization, SECRET);
    next()
  } catch(err) {
    res.status(401).json({ message: "token invalid" })
    return
  }
}