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
}

module.exports = usernameExistsOrPasswordInvalid