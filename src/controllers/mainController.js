const {validationResult} = require('express-validator')
const usersQueries = require('../dbQueries/users/usersQueries')
const seasonsQueries = require('../dbQueries/main/seasonsQueries')

const mainController = {
    login: (req,res) => {
        try{

            req.session.destroy()
            return res.render('login',{title:'Login'})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    loginProcess: async(req,res) => {
        try{

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('login',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Login'
                })
            }

            //login
            let userToLogin = await usersQueries.findUser(req.body.user)
            
            userToLogin.password = ''
            req.session.userLogged = userToLogin

            return res.redirect('/main-menu')

        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }
    },
    logoutProcess: (req,res) => {

        req.session.destroy()

        return res.redirect('/')
    },
    mainMenu: async(req,res) => {
        try{

            const currentSeason = await seasonsQueries.currentSeason()

            return res.render('mainMenu',{title:'Menu principal',currentSeason})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    }
}

module.exports = mainController

