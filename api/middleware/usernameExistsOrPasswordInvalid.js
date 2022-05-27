const Users = require('../auth/auth-model')

const usernameExistsOrPasswordInvalid = username = async (req, res, next) => {
   const  { username, password } = req.body
   const checker = await Users.findUser({username})
   console.log(checker)
   if (checker.length === 0) {
        res.status(401).json({ message: "invalid credentials"})
        return
   } else {
        next()
   }
    // 4- On FAILED login due to `username` not existing in the db
    // the response body should include a string exactly as follows: "invalid credentials".
}

module.exports = usernameExistsOrPasswordInvalid