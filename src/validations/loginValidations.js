const {body} = require('express-validator')
const bcrypt = require('bcryptjs')
const usersQueries = require('../controllers/dbQueries/users/usersQueries')

const loginValidations = {
    login: [
        body('user')
            .notEmpty().withMessage('Ingrese un usuario').bail()
            .custom(async(value,{ req }) => {
                const user = req.body.user
                const userToLogin = await usersQueries.findUser(user)
                if (!userToLogin) {
                    throw new Error('Usuario inválido')
                }
                return true
            }).bail(),
        body('password')
            .notEmpty().withMessage('Ingrese una contraseña').bail()
            .custom(async(value,{ req }) => {
                const user = req.body.user
                const userToLogin = await usersQueries.findUser(user)
                if(userToLogin){
                    if (!bcrypt.compareSync(req.body.password, userToLogin.password)) {
                        throw new Error('Contraseña inválida')
                    }
                }else{
                    throw new Error('Contraseña inválida')
                }
                return true
        })
    ]
}

module.exports = loginValidations