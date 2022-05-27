const Users = require('../auth/auth-model')

const alreadyTakeUsername = async (req, rest, next) => {
    const { username } = req.body
    const checker = await Users.findUser({username})
    if (checker.length > 0) {
        rest.status(400).json({ message: "username taken" })
        return
    } else {
        next()
    }
}
  
module.exports = alreadyTakeUsername