const Users = require('../auth/auth-model')

const alreadyTakeUsername = async (req, rest, next) => {
    const { username } = req.body
    const checker = await Users.findUser({username})
    // console.log(checker)
    if (checker.length > 0) {
        rest.status(400).json({ message: "username taken" })
        return
    } else {
        next()
    }
    // 4- On FAILED registration due to the `username` being taken,
    // the response body should include a string exactly as follows: "username taken".
}
  
module.exports = alreadyTakeUsername